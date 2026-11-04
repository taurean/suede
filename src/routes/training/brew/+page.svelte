<!-- Training prototype: design-training round "brew", a visual pass over the drawdown brew flow. The engine in ./engine is copied unchanged from that project. Deleted when training graduates. -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		canRestart,
		feed,
		resolveTarget,
		restart,
		settledGrams,
		startEngine,
		type EngineState
	} from './engine/steps';
	import { METHODS } from './engine/methods';
	import { localIso, saveBrew } from './engine/brews';
	import { connectScale, type Sample } from './engine/timemore';
	import { createSimScale, simActions, type SimAction } from './sim-scale';
	import './brew-tokens.css';
	import Ledger from './Ledger.svelte';
	import Pill from './Pill.svelte';
	import Review, { type ReviewInput } from './Review.svelte';
	import SimDock from './SimDock.svelte';
	import Start, { type StartChoice } from './Start.svelte';
	import StatusStrip from './StatusStrip.svelte';
	import StepTicks from './StepTicks.svelte';
	import StepView from './StepView.svelte';

	// The scale may only notify when the reading changes. Re-feeding the latest reading on this
	// interval lets a steady weight count as settled. Repeats drive the engine and aren't stored.
	const TICK_MS = 200;

	let choice = $state<StartChoice | null>(null);
	let screen = $state<'start' | 'brew' | 'review' | 'saved'>('start');
	let status = $state('Not connected');
	let disconnect = $state<(() => void) | null>(null);
	let sim = $state.raw<ReturnType<typeof createSimScale> | null>(null);
	let simSpeed = $state(1);

	let latest = $state<Sample | null>(null);
	let samples = $state.raw<Sample[]>([]);
	let engine = $state.raw<EngineState>(startEngine());
	let brewStartedAt: number | null = null;
	let brewEndedAt: number | null = null;
	let now = $state(Date.now());

	const method = $derived(METHODS[choice?.method ?? 'espresso']);
	const steps = $derived(choice ? method.steps(choice) : []);
	const step = $derived(steps[Math.min(engine.index, steps.length - 1)]);
	const marks = $derived(
		steps.flatMap((s) =>
			s.kind === 'fillTimed' &&
			(typeof s.target === 'number' || engine.results.some((r) => r.id === 'grounds'))
				? [{ seconds: s.targetSeconds, grams: resolveTarget(s.target, engine.results) }]
				: []
		)
	);
	const settled = $derived(settledGrams(engine.recent));
	const baseline = $derived(
		step && 'baselineFrom' in step ? (engine.baselines[step.baselineFrom] ?? 0) : 0
	);
	const simChoices = $derived(
		sim && screen === 'brew' && step ? simActions(step, engine, latest?.grams ?? 0) : []
	);

	// Reads `latest` so it re-evaluates on every sample; the sim's motion isn't reactive itself.
	const simBusy = $derived(latest !== null && (sim?.isMoving() ?? false));

	function onSample(sample: Sample) {
		latest = sample;
		if (sim) now = sample.at;
		if (screen !== 'brew') return;
		brewStartedAt ??= sample.at;
		samples = [...samples, sample];
		advance(sample);
	}

	function advance(sample: Sample) {
		engine = feed(engine, steps, sample);
		if (engine.done) {
			brewEndedAt = sample.at;
			screen = 'review';
		}
	}

	const tick = setInterval(() => {
		if (sim) return;
		now = Date.now();
		if (screen === 'brew' && latest && now - latest.at >= TICK_MS) {
			advance({ at: now, grams: latest.grams });
		}
	}, TICK_MS);
	onDestroy(() => {
		clearInterval(tick);
		disconnect?.();
	});

	// The scale turning off mid-brew keeps the brew; reconnecting resumes it. Turning it off on the
	// last step (milk) means the scale's job is done, so the review opens instead.
	function onDisconnect() {
		status = 'Disconnected';
		disconnect = null;
		latest = null; // stops the tick from replaying a stale reading
		const onLastStep = engine.index === steps.length - 1 && step.kind === 'offScale';
		if (screen === 'brew' && onLastStep) {
			brewEndedAt = Date.now();
			screen = 'review';
		}
	}

	async function connect() {
		try {
			status = 'Connecting…';
			disconnect = await connectScale(onSample, onDisconnect);
			status = 'Connected';
		} catch (err) {
			status = (err as Error).message;
		}
	}

	function startSim() {
		const next = createSimScale(onSample);
		sim = next;
		status = 'Connected';
		disconnect = () => {
			next.stop();
			sim = null;
			onDisconnect();
		};
	}

	function begin(next: StartChoice) {
		choice = next;
		engine = startEngine();
		samples = [];
		brewStartedAt = null;
		brewEndedAt = null;
		screen = 'brew';
	}

	async function save(input: ReviewInput) {
		if (!choice) return;
		const startedAt = brewStartedAt ?? Date.now();
		await saveBrew({
			id: crypto.randomUUID(),
			startedAt: localIso(startedAt),
			endedAt: localIso(brewEndedAt ?? Date.now()),
			dose: choice.dose,
			steps: engine.results,
			samples: samples.map((s) => ({ t: s.at - startedAt, g: s.grams })),
			...method.record(engine.results, choice),
			...input
		});
		screen = 'saved';
	}

	function changeSpeed() {
		simSpeed = simSpeed === 1 ? 4 : 1;
		sim?.setSpeed(simSpeed);
	}
</script>

<svelte:head><title>Drawdown · brew</title></svelte:head>

<div class="brew" data-theme="dark">
	<StatusStrip
		{status}
		connected={!!disconnect}
		grams={latest?.grams ?? null}
		onConnect={connect}
	/>

	{#if screen === 'brew'}
		<StepTicks {steps} index={engine.index} />
		<main class="screen l:grid">
			<section class="now">
				<StepView
					{step}
					{engine}
					{latest}
					{samples}
					{settled}
					{baseline}
					{now}
					{marks}
					ratio={method.ratio}
					rateLabel={method.rateLabel}
				/>
				{#if canRestart(step) && engine.index > 0}
					<div>
						<Pill onclick={() => (engine = restart(engine, steps))}>Restart this step</Pill>
					</div>
				{/if}
			</section>
			<aside class="record"><Ledger results={engine.results} /></aside>
		</main>
	{:else if screen === 'review'}
		<main class="review">
			<Review
				onSave={save}
				initialBagId={choice?.bagId ?? null}
				initialGrindSetting={choice?.grindSetting ?? ''}
			/>
		</main>
	{:else}
		<main class="screen l:grid">
			<section class="now">
				{#if screen === 'start'}
					<Start onStart={begin} />
				{:else}
					<h1 class="saved">Saved</h1>
					<div><Pill variant="solid" onclick={() => (screen = 'start')}>New brew</Pill></div>
				{/if}
			</section>
		</main>
	{/if}

	<SimDock
		active={!!sim}
		actions={simChoices}
		busy={simBusy}
		speed={simSpeed}
		onStart={startSim}
		onAction={(a: SimAction) => sim?.move(a)}
		onSpeed={changeSpeed}
		onOff={() => disconnect?.()}
	/>
</div>

<style>
	.brew {
		--grid-max-width: var(--page-max);
		--grid-gutter: var(--gap-2xl);
		/* Full-bleed strips keep their content on the grid's edge, including past --page-max. */
		--brew-edge: max(var(--grid-gutter), calc((100% - var(--page-max)) / 2 + var(--grid-gutter)));
		display: flex;
		flex-direction: column;
		min-block-size: 100dvh;
		background: var(--brew-ground);
		color: var(--hue-z0-fg);
		font-family: var(--ff-sans);
	}
	.screen {
		/* l:grid centres with auto margins, which would otherwise shrink it to its content in this flex column. */
		inline-size: 100%;
		flex: 1;
		align-content: start;
		row-gap: var(--gap-3xl);
		padding-block: var(--gap-3xl);
	}
	.review {
		flex: 1;
	}
	.now {
		grid-column: span 12;
		display: grid;
		align-content: start;
		gap: var(--gap-xl);
	}
	.record {
		grid-column: span 12;
	}
	.saved {
		margin: 0;
		font-size: var(--text-6xl);
		line-height: var(--leading-tight);
		font-weight: 200;
		color: var(--hue-white);
	}
	@media (min-width: 60rem) {
		.now {
			grid-column: span 9;
		}
		.record {
			grid-column: span 3;
			order: -1;
		}
	}
</style>
