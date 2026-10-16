<script lang="ts">
	import { tick, untrack } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		readTiming,
		scheduleLetters,
		splitGraphemes,
		widthTransitionMs,
		type LetterSchedule
	} from './dynamic-label';

	interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
		text: string;
		/** Announce each change through a polite live region. Off by default. */
		announce?: boolean;
	}

	let { text, announce = false, class: className, ...rest }: Props = $props();

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
	let widthDurationMs = $state(0);

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
		const timing = readTiming(getComputedStyle(container));
		const outgoing = scheduleLetters(shownLetters.length, timing);
		widthDurationMs = widthTransitionMs(timing);

		// Mid-transition the width is already locked and animating; retargeting
		// it lets the transition continue from wherever it currently is.
		lockedWidthPx ??= lettersElement.getBoundingClientRect().width;
		schedule = outgoing;
		letterPhase = 'exiting';

		await document.fonts.ready;
		await tick();
		if (run !== transitionRun) return;

		lockedWidthPx = measurer.getBoundingClientRect().width;
		widthSettlesAt = performance.now() + widthDurationMs;
		pendingTimer = setTimeout(() => enter(nextText, timing, run), outgoing.totalMs);
	}

	async function enter(nextText: string, timing: ReturnType<typeof readTiming>, run: number) {
		shownText = nextText;
		schedule = scheduleLetters(shownLetters.length, timing);
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
	class={['dynamic-label', className]}
	data-letter-phase={letterPhase}
	style:width={lockedWidthPx === undefined ? undefined : `${lockedWidthPx}px`}
	style:--dynamic-label-width-transition={`${widthDurationMs}ms`}
>
	<span bind:this={lettersElement} class="dynamic-label-letters" aria-hidden="true"
		>{#each shownLetters as letter, index (index)}<span
				class="dynamic-label-letter"
				style:transition-duration={`${schedule.letterDurationMs}ms`}
				style:transition-delay={`${index * schedule.staggerMs}ms`}>{letter}</span
			>{/each}</span
	>
	<span bind:this={measurer} class="dynamic-label-measurer" aria-hidden="true"
		>{#each targetLetters as letter, index (index)}<span class="dynamic-label-letter">{letter}</span
			>{/each}</span
	>
	<span
		class="dynamic-label-accessible"
		aria-live={announce ? 'polite' : undefined}
		aria-atomic={announce ? 'true' : undefined}>{text}</span
	>
</span>

<style>
	@layer layout {
		/* Inline-flex drops the whitespace-only text between children, which
		   white-space: pre would otherwise render as width. */
		.dynamic-label {
			display: inline-flex;
			position: relative;
			box-sizing: content-box;
			white-space: pre;
			padding: var(--dynamic-label-bleed, 0.5em);
			margin: calc(-1 * var(--dynamic-label-bleed, 0.5em));
			transition: width var(--dynamic-label-width-transition) ease;
		}

		.dynamic-label-letter {
			display: inline-block;
			transition-property: filter, opacity, transform;
			transition-timing-function: ease;
		}

		[data-letter-phase='exiting'] .dynamic-label-letters .dynamic-label-letter {
			filter: blur(var(--dynamic-label-blur, 0.22em));
			opacity: var(--dynamic-label-peak-blur-opacity, 0);
			transform: translateY(var(--dynamic-label-travel, 0.25em));
		}

		[data-letter-phase='entering'] .dynamic-label-letters .dynamic-label-letter {
			filter: blur(var(--dynamic-label-blur, 0.22em));
			opacity: var(--dynamic-label-peak-blur-opacity, 0);
			transform: translateY(calc(-1 * var(--dynamic-label-travel, 0.25em)));
			transition-property: none;
		}

		.dynamic-label-measurer {
			position: absolute;
			inset-block-start: 0;
			inset-inline-start: 0;
			width: max-content;
			visibility: hidden;
			pointer-events: none;
		}

		.dynamic-label-accessible {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		@media (prefers-reduced-motion: reduce) {
			.dynamic-label,
			.dynamic-label-letter {
				transition: none;
			}
		}
	}
</style>
