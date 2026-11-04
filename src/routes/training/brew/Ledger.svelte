<script lang="ts">
	import type { StepResult } from './engine/steps';

	const { results }: { results: StepResult[] } = $props();

	const recorded = $derived(results.filter((r) => r.actual !== undefined));
	const signed = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}g`;
</script>

{#if recorded.length}
	<dl class="ledger">
		{#each recorded as r (r.id)}
			<div class="row">
				<dt>{r.id.replaceAll('-', ' ')}</dt>
				<dd>
					{r.actual}g
					{#if r.target !== undefined}({signed(r.actual! - r.target)}){/if}
					{#if r.seconds}in {r.seconds}s{/if}
				</dd>
			</div>
		{/each}
	</dl>
{/if}

<style>
	.ledger {
		margin: 0;
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		line-height: var(--leading-loose);
		font-variant-numeric: tabular-nums;
		color: var(--hue-z0-muted);
	}
	.row {
		padding-block: var(--gap-sm);
		border-block-start: var(--border-w-thin) solid var(--hue-z0-border);
	}
	dt {
		text-transform: uppercase;
	}
	dd {
		margin: 0;
		color: var(--hue-z0-fg);
	}
</style>
