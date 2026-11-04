<script lang="ts">
	type Props = {
		value?: string;
		unit?: string;
		word?: string;
		side?: string;
		tone?: 'ok' | 'off';
		size?: 'full' | 'compact';
	};
	const { value, unit, word, side, tone, size = 'full' }: Props = $props();
</script>

<div class="frame">
	<p class="readout" data-tone={tone} data-size={size}>
		{#if word}
			<span class="word">{word}</span>
		{:else}
			<span class="value">{value}</span><span class="unit">{unit}</span>
			{#if side}<span class="side">{side}</span>{/if}
		{/if}
	</p>
</div>

<style>
	.frame {
		container-type: inline-size;
	}
	.readout {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: var(--gap-md);
		margin: 0;
		font-family: var(--ff-sans);
		font-variant-numeric: tabular-nums;
		color: var(--hue-white);
	}
	.readout[data-tone='ok'] {
		color: var(--brew-ok);
	}
	.readout[data-tone='off'] {
		color: var(--brew-off);
	}
	.value {
		/* Display element: fills its container so it reads from across the counter, capped so it fits one screen. */
		font-size: min(36cqi, 42dvh);
		line-height: 1;
		font-weight: 200;
	}
	.readout[data-size='compact'] .value {
		font-size: min(24cqi, 24dvh);
	}
	.word {
		font-size: var(--text-7xl);
		line-height: var(--leading-tight);
		font-weight: 200;
	}
	.unit {
		font-size: var(--text-2xl);
		line-height: var(--leading-ui);
		color: var(--hue-z0-muted);
	}
	.side {
		margin-inline-start: auto;
		font-size: var(--text-6xl);
		line-height: var(--leading-ui);
		font-weight: 200;
		color: var(--hue-z0-fg);
	}
</style>
