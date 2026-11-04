<script lang="ts">
	type Props = { value: number; min: number; max: number; target: number; tolerance: number };
	const { value, min, max, target, tolerance }: Props = $props();

	const TICKS = 40;
	const at = (grams: number) => Math.min(100, Math.max(0, ((grams - min) / (max - min)) * 100));
</script>

<!-- The scale's missing dial. The number above says the same thing, so it's decorative to a screen reader. -->
<svg class="gauge" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
	<rect
		class="window"
		x={at(target - tolerance)}
		width={Math.max(at(target + tolerance) - at(target - tolerance), 0.4)}
		y="0"
		height="24"
	/>
	{#each { length: TICKS + 1 }, i}
		<line
			class="tick"
			x1={(i / TICKS) * 100}
			x2={(i / TICKS) * 100}
			y1="0"
			y2={i % 5 === 0 ? 12 : 6}
		/>
	{/each}
	<line class="target" x1={at(target)} x2={at(target)} y1="0" y2="24" />
	<line class="needle" x1={at(value)} x2={at(value)} y1="0" y2="24" />
</svg>

<style>
	.gauge {
		display: block;
		inline-size: 100%;
		block-size: var(--gap-3xl);
		overflow: visible;
	}
	line {
		vector-effect: non-scaling-stroke;
	}
	.window {
		fill: color-mix(in oklch, var(--brew-ok) 25%, transparent);
	}
	.tick {
		stroke: var(--hue-z0-muted);
		stroke-width: var(--border-w-thin);
	}
	.target {
		stroke: var(--brew-ok);
		stroke-width: var(--border-w-thin);
	}
	.needle {
		stroke: var(--brew-accent);
		stroke-width: var(--border-w-thick);
	}
</style>
