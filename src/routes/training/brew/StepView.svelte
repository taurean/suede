<script lang="ts">
	import { shotSeries } from './engine/flow';
	import { EMPTY_G, isWithin, resolveTarget, type EngineState, type Step } from './engine/steps';
	import type { Sample } from './engine/timemore';
	import Gauge from './Gauge.svelte';
	import Readout from './Readout.svelte';
	import ShotTrace from './ShotTrace.svelte';

	type Props = {
		step: Step;
		engine: EngineState;
		latest: Sample | null;
		samples: Sample[];
		settled: number | null;
		baseline: number;
		now: number;
		marks: { seconds: number; grams: number }[];
		ratio: number;
		rateLabel: string;
	};
	const { step, engine, latest, samples, settled, baseline, now, marks, ratio, rateLabel }: Props =
		$props();

	const change = $derived(latest ? latest.grams - baseline : 0);
	const CHECK_GAUGE_SPAN_G = 3;
</script>

<p class="stage">{step.stage}</p>
{#if engine.awaitingClear}
	<h1 class="prompt">Clear the scale</h1>
{:else}
	<h1 class="prompt">{step.prompt}</h1>

	{#if step.kind === 'place' && latest && latest.grams > EMPTY_G && settled === null}
		<p class="hint">Hold still…</p>
	{:else if step.kind === 'fill'}
		{@const left = step.target - change}
		{#if isWithin(left, 0, step.tolerance)}
			<Readout word="On target" tone="ok" />
		{:else if left > 0}
			<Readout value={left.toFixed(1)} unit="g left" />
		{:else}
			<Readout value={(-left).toFixed(1)} unit="g over" tone="off" />
		{/if}
		<Gauge
			value={change}
			min={0}
			max={step.target * 1.15}
			target={step.target}
			tolerance={step.tolerance}
		/>
		{#if engine.lastSettledChange !== null && isWithin(engine.lastSettledChange, step.target, step.tolerance)}
			<p class="hint" data-tone="ok">Settled. Take the cup off.</p>
		{/if}
	{:else if step.kind === 'check'}
		{#if latest && latest.grams < EMPTY_G}
			<p class="hint">Place the cup with the grounds.</p>
		{:else}
			{@const off = change - step.expected}
			{#if isWithin(off, 0, step.tolerance)}
				<Readout word="Within range" tone="ok" />
			{:else}
				<Readout
					value={Math.abs(off).toFixed(1)}
					unit={off < 0 ? 'g short' : 'g over'}
					tone="off"
				/>
			{/if}
			<Gauge
				value={change}
				min={step.expected - CHECK_GAUGE_SPAN_G}
				max={step.expected + CHECK_GAUGE_SPAN_G}
				target={step.expected}
				tolerance={step.tolerance}
			/>
			{#if engine.lastSettledChange !== null && isWithin(engine.lastSettledChange, step.expected, step.tolerance)}
				<p class="hint" data-tone="ok">Good. Take the cup off.</p>
			{:else}
				<p class="hint">Regrind or adjust, then set it back on.</p>
			{/if}
		{/if}
	{:else if step.kind === 'fillTimed'}
		{#if engine.timerStartedAt === null}
			<p class="hint">
				{step.endsOn === 'target' ? 'Waiting for first water…' : 'Waiting for first drops…'}
			</p>
		{:else}
			{@const seconds = ((engine.timerEndedAt ?? now) - engine.timerStartedAt) / 1000}
			{@const series = shotSeries(samples, engine.timerStartedAt, baseline)}
			{@const target = resolveTarget(step.target, engine.results)}
			{@const ratioDose = marks[marks.length - 1].grams / ratio}
			<Readout value={change.toFixed(1)} unit="g" side="{seconds.toFixed(1)}s" size="compact" />
			<p class="meta">
				1:{(change / ratioDose).toFixed(2)} of 1:{ratio} · target {target}g by {step.targetSeconds}s
			</p>
			{#if engine.targetReachedAt !== null}
				<p class="hint">Next pour in {Math.max(0, step.targetSeconds - seconds).toFixed(0)}s</p>
			{/if}
			{#if engine.timerEndedAt}<p class="hint" data-tone="ok">
					Flow stopped. Take the cup off.
				</p>{/if}
			<ShotTrace weight={series.weight} flow={series.flow} {marks} {rateLabel} />
		{/if}
	{/if}
{/if}

<style>
	.stage,
	.meta {
		margin: 0;
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		line-height: var(--leading-loose);
		text-transform: uppercase;
		font-variant-numeric: tabular-nums;
	}
	.stage {
		color: var(--brew-accent);
	}
	.meta {
		color: var(--hue-z0-muted);
	}
	.prompt {
		margin: 0;
		max-inline-size: 22ch;
		font-family: var(--ff-sans);
		font-size: var(--text-5xl);
		line-height: var(--leading-tight);
		font-weight: 300;
		color: var(--hue-white);
	}
	.hint {
		margin: 0;
		font-size: var(--text-xl);
		line-height: var(--leading-tight);
		color: var(--hue-z0-fg);
	}
	.hint[data-tone='ok'] {
		color: var(--brew-ok);
	}
</style>
