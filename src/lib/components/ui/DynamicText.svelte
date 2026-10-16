<!--
@component
Animates its text letter by letter whenever the `text` prop changes. Wrap it
in an element that carries the styles; see the UI/DynamicText docs in
Storybook for what styling applies.
-->

<script lang="ts">
	import { tick, untrack } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		WIDTH_TRANSITION_MS,
		scheduleLetters,
		splitGraphemes,
		type LetterSchedule
	} from './dynamic-text';

	interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
		text: string;
		/** Announce each change through a polite live region. On by default. */
		announce?: boolean;
	}

	const { text, announce = true, class: className, ...rest }: Props = $props();

	/**
	 * `exiting` and `settled` transition each letter with its staggered delay.
	 * `entering` places letters at their blurred, raised start with transitions
	 * off, so the following switch to `settled` animates them into place.
	 */
	type LetterPhase = 'settled' | 'exiting' | 'entering';

	let container: HTMLSpanElement;
	let lettersElement: HTMLSpanElement;
	let measurer: HTMLSpanElement;

	let shownText = $state(untrack(() => text));
	let letterPhase = $state<LetterPhase>('settled');
	let schedule = $state<LetterSchedule>({ staggerMs: 0, letterDurationMs: 0, totalMs: 0 });
	let lockedWidthPx = $state<number>();

	const shownLetters = $derived(splitGraphemes(shownText));
	const targetLetters = $derived(splitGraphemes(text));

	let pendingTimer: ReturnType<typeof setTimeout> | undefined;
	let isTransitioning = false;
	let widthSettlesAt = 0;
	// Incremented on every new transition and on destroy; an async step that
	// sees a different value has been superseded and stops.
	let transitionRun = 0;

	function prefersReducedMotion(): boolean {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function cancelPendingTimer() {
		clearTimeout(pendingTimer);
		pendingTimer = undefined;
	}

	async function transitionTo(nextText: string) {
		cancelPendingTimer();
		const run = ++transitionRun;

		if (prefersReducedMotion()) {
			shownText = nextText;
			letterPhase = 'settled';
			lockedWidthPx = undefined;
			isTransitioning = false;
			return;
		}

		isTransitioning = true;
		const outgoing = scheduleLetters(shownLetters.length);

		// Mid-transition the width is already locked and animating; retargeting
		// it lets the transition continue from wherever it currently is.
		lockedWidthPx ??= lettersElement.getBoundingClientRect().width;
		schedule = outgoing;
		letterPhase = 'exiting';

		await document.fonts.ready;
		await tick();
		if (run !== transitionRun) return;

		lockedWidthPx = measurer.getBoundingClientRect().width;
		widthSettlesAt = performance.now() + WIDTH_TRANSITION_MS;
		pendingTimer = setTimeout(() => enter(nextText, run), outgoing.totalMs);
	}

	async function enter(nextText: string, run: number) {
		shownText = nextText;
		schedule = scheduleLetters(shownLetters.length);
		letterPhase = 'entering';

		await tick();
		if (run !== transitionRun) return;

		// Reading layout commits the entering start state, so switching to
		// `settled` transitions from it instead of jumping straight to rest.
		void container.offsetWidth;
		letterPhase = 'settled';

		const widthRemainingMs = Math.max(0, widthSettlesAt - performance.now());
		pendingTimer = setTimeout(finish, Math.max(schedule.totalMs, widthRemainingMs));
	}

	function finish() {
		pendingTimer = undefined;
		isTransitioning = false;
		lockedWidthPx = undefined;
	}

	$effect(() => {
		const nextText = text;
		untrack(() => {
			if (nextText === shownText && !isTransitioning) return;
			void transitionTo(nextText);
		});
	});

	$effect(() => () => {
		transitionRun++;
		cancelPendingTimer();
	});
</script>

<span
	{...rest}
	bind:this={container}
	class={['dynamic-text', className]}
	data-letter-phase={letterPhase}
	style:width={lockedWidthPx === undefined ? undefined : `${lockedWidthPx}px`}
	style:transition-duration={`${WIDTH_TRANSITION_MS}ms`}
>
	<span bind:this={lettersElement} class="dynamic-text-letters" aria-hidden="true"
		>{#each shownLetters as letter, index (index)}<span
				class="dynamic-text-letter"
				style:transition-duration={`${schedule.letterDurationMs}ms`}
				style:transition-delay={`${index * schedule.staggerMs}ms`}>{letter}</span
			>{/each}</span
	>
	<span bind:this={measurer} class="dynamic-text-measurer" aria-hidden="true"
		>{#each targetLetters as letter, index (index)}<span class="dynamic-text-letter">{letter}</span
			>{/each}</span
	>
	<span
		class="dynamic-text-accessible"
		aria-live={announce ? 'polite' : undefined}
		aria-atomic={announce ? 'true' : undefined}>{text}</span
	>
</span>

<style>
	@layer layout {
		/* Inline-flex drops the whitespace-only text between children, which
		   white-space: pre would otherwise render as width. */
		.dynamic-text {
			display: inline-flex;
			position: relative;
			box-sizing: content-box;
			white-space: pre;
			padding: 0.5em;
			margin: -0.5em;
			transition-property: width;
			transition-timing-function: ease;
		}

		.dynamic-text-letter {
			display: inline-block;
			transition-property: filter, opacity, transform;
			transition-timing-function: ease;
		}

		[data-letter-phase='exiting'] .dynamic-text-letters .dynamic-text-letter {
			filter: blur(0.22em);
			opacity: 0;
			transform: translateY(0.25em);
		}

		[data-letter-phase='entering'] .dynamic-text-letters .dynamic-text-letter {
			filter: blur(0.22em);
			opacity: 0;
			transform: translateY(-0.25em);
			transition-property: none;
		}

		.dynamic-text-measurer {
			position: absolute;
			inset-block-start: 0;
			inset-inline-start: 0;
			width: max-content;
			visibility: hidden;
			pointer-events: none;
		}

		.dynamic-text-accessible {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		@media (prefers-reduced-motion: reduce) {
			.dynamic-text,
			.dynamic-text-letter {
				transition: none;
			}
		}
	}
</style>
