<script lang="ts">
	import Pill from './Pill.svelte';

	type Props = { status: string; connected: boolean; grams: number | null; onConnect: () => void };
	const { status, connected, grams, onConnect }: Props = $props();
</script>

<header class="strip l:repel">
	<span class="reading" data-connected={connected}>{status}</span>
	{#if grams !== null}<span class="reading">{grams.toFixed(1)}g on scale</span>{/if}
	{#if !connected}<Pill onclick={onConnect}>Connect scale</Pill>{/if}
</header>

<style>
	.strip {
		--repel-gap: var(--gap-md);
		align-items: center;
		min-block-size: var(--gap-4xl);
		padding: var(--gap-sm) var(--brew-edge);
		border-block-end: var(--border-w-thin) solid var(--hue-z0-border);
	}
	.reading {
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		line-height: var(--leading-ui);
		text-transform: uppercase;
		font-variant-numeric: tabular-nums;
		color: var(--hue-z0-muted);
	}
	.reading[data-connected='true'] {
		color: var(--brew-ok);
	}
</style>
