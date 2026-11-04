<script lang="ts">
	import type { Point } from './engine/flow';

	type Mark = { seconds: number; grams: number };
	type Props = { weight: Point[]; flow: Point[]; marks: Mark[]; rateLabel: string };
	const { weight, flow, marks, rateLabel }: Props = $props();

	const WIDTH = 480;
	const HEIGHT = 160;
	const CELL = 10;
	const COLUMNS = WIDTH / CELL;
	const ROWS = HEIGHT / CELL;

	const lastMark = $derived(marks[marks.length - 1]);
	const maxSeconds = $derived(Math.max(lastMark.seconds + 5, weight.at(-1)?.seconds ?? 0));
	const maxWeight = $derived(Math.max(lastMark.grams * 1.2, ...weight.map((p) => p.value)));
	const maxFlow = $derived(Math.max(4, ...flow.map((p) => p.value)));

	const line = $derived(
		weight
			.map(
				(p) =>
					`${(p.seconds / maxSeconds) * WIDTH},${HEIGHT - (Math.max(0, p.value) / maxWeight) * HEIGHT}`
			)
			.join(' ')
	);
	// Flow is noisy, so it prints as a dot matrix: each column is the peak rate in its slice of time.
	const litRows = $derived.by(() => {
		const peaks = new Array(COLUMNS).fill(0);
		for (const p of flow) {
			const column = Math.min(COLUMNS - 1, Math.floor((p.seconds / maxSeconds) * COLUMNS));
			peaks[column] = Math.max(peaks[column], p.value);
		}
		return peaks.map((peak) => Math.round((peak / maxFlow) * ROWS));
	});
</script>

<div class="trace">
	<figure>
		<figcaption>Weight (g) · target {lastMark.grams}g</figcaption>
		<svg viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-label="Weight over time">
			{#each marks as mark (mark.seconds)}
				{@const y = HEIGHT - (mark.grams / maxWeight) * HEIGHT}
				{@const x = (mark.seconds / maxSeconds) * WIDTH}
				<line class="mark" x1="0" x2={WIDTH} y1={y} y2={y} />
				<line class="mark" x1={x} x2={x} y1="0" y2={HEIGHT} />
			{/each}
			<polyline points={line} />
		</svg>
	</figure>
	<figure>
		<figcaption>{rateLabel}</figcaption>
		<svg viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-label="{rateLabel} over time">
			{#each litRows as lit, column (column)}
				{#each { length: ROWS }, row}
					<circle
						cx={column * CELL + CELL / 2}
						cy={HEIGHT - row * CELL - CELL / 2}
						r="3"
						data-lit={row < lit}
					/>
				{/each}
			{/each}
		</svg>
	</figure>
</div>

<style>
	.trace {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--gap-xl);
	}
	figure {
		margin: 0;
	}
	figcaption {
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		line-height: var(--leading-ui);
		text-transform: uppercase;
		color: var(--hue-z0-muted);
		margin-block-end: var(--gap-md);
	}
	svg {
		display: block;
		inline-size: 100%;
		block-size: auto;
		border-block-end: var(--border-w-thin) solid var(--hue-z0-border);
	}
	polyline {
		fill: none;
		stroke: var(--brew-accent);
		stroke-width: var(--border-w-standard);
		vector-effect: non-scaling-stroke;
	}
	.mark {
		stroke: var(--hue-z0-muted);
		stroke-dasharray: 3 5;
		vector-effect: non-scaling-stroke;
	}
	circle {
		fill: var(--hue-z0-border);
	}
	circle[data-lit='true'] {
		fill: var(--brew-accent);
	}
</style>
