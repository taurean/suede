<script lang="ts">
	import { Slider } from 'bits-ui';

	type Props = { label: string; value: number; min: number; max: number; valueLabel: string };
	let { label, value = $bindable(), min, max, valueLabel }: Props = $props();
</script>

<div class="row">
	<span class="name">{label}</span>
	<span class="value">{value}</span>
	<div class="control">
		<Slider.Root type="single" bind:value {min} {max}>
			{#snippet child({ props })}
				<span {...props} class="track">
					<Slider.Range>
						{#snippet child({ props: rangeProps })}
							<span {...rangeProps} class="range"></span>
						{/snippet}
					</Slider.Range>
					<Slider.Thumb index={0} aria-label={valueLabel}>
						{#snippet child({ props: thumbProps })}
							<span {...thumbProps} class="thumb"></span>
						{/snippet}
					</Slider.Thumb>
				</span>
			{/snippet}
		</Slider.Root>
	</div>
</div>

<style>
	.row {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--gap-md);
		align-items: baseline;
	}
	.name,
	.value {
		font-size: var(--text-md);
		line-height: var(--leading-ui);
		text-transform: capitalize;
	}
	.value {
		font-variant-numeric: tabular-nums;
		color: var(--hue-white);
	}
	.control {
		grid-column: 1 / -1;
	}
	.track {
		position: relative;
		display: flex;
		align-items: center;
		block-size: var(--gap-3xl);
		touch-action: none;
		cursor: pointer;
		border-block-end: 0;
		background: linear-gradient(var(--hue-z0-border), var(--hue-z0-border)) center / 100%
			var(--border-w-thin) no-repeat;
	}
	.range {
		position: absolute;
		block-size: var(--border-w-standard);
		background: var(--brew-accent);
	}
	.thumb {
		display: block;
		inline-size: var(--gap-sm);
		block-size: var(--gap-2xl);
		border-radius: var(--radius-full);
		background: var(--hue-white);
		cursor: grab;
	}
</style>
