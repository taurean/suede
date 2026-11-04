<script lang="ts">
	import type { Step } from './engine/steps';

	const { steps, index }: { steps: Step[]; index: number } = $props();
</script>

<!-- Progress as a printed ruler: a long tick starts each stage. Decorative; the stage label says where you are. -->
<div class="ticks" aria-hidden="true">
	{#each steps as step, i (step.id)}
		<span
			class="tick"
			data-stage-start={i === 0 || steps[i - 1].stage !== step.stage}
			data-state={i < index ? 'done' : i === index ? 'now' : 'next'}
		></span>
	{/each}
</div>

<style>
	.ticks {
		display: flex;
		justify-content: space-between;
		align-items: start;
		padding: 0 var(--brew-edge);
		block-size: var(--gap-lg);
	}
	.tick {
		inline-size: var(--border-w-thin);
		block-size: 50%;
		background: var(--hue-z0-border);
	}
	.tick[data-stage-start='true'] {
		block-size: 100%;
	}
	.tick[data-state='done'] {
		background: var(--hue-z0-muted);
	}
	.tick[data-state='now'] {
		block-size: 100%;
		inline-size: var(--border-w-thick);
		background: var(--brew-accent);
	}
</style>
