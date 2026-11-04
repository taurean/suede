<!-- Training prototype. -->
<script lang="ts">
	let { score, max = 10 }: { score: number; max?: number } = $props();

	const ticks = 48;
	const filled = $derived(Math.round((score / max) * ticks));
</script>

<div class="score">
	<div
		class="meter"
		role="meter"
		aria-label="Final score"
		aria-valuenow={score}
		aria-valuemin={0}
		aria-valuemax={max}
	>
		{#each { length: ticks }, i (i)}
			<i data-filled={i < filled ? '' : undefined}></i>
		{/each}
	</div>
	<p class="value">{score.toFixed(1)}</p>
</div>

<style>
	.score {
		display: flex;
		align-items: center;
		gap: var(--gap-xl);
	}
	.meter {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-self: stretch;
		min-block-size: var(--gap-4xl);
	}
	i {
		inline-size: var(--border-w-thin);
		background: var(--hue-neutral-300);
	}
	i[data-filled] {
		background: currentColor;
	}
	.value {
		margin: 0;
		font-family: var(--ff-didone-display);
		font-size: var(--text-5xl);
		line-height: var(--leading-ui);
	}
</style>
