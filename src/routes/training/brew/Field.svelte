<script lang="ts">
	import type { Snippet } from 'svelte';

	const { label, children }: { label: string; children: Snippet } = $props();
</script>

<label class="field">
	<span class="name">{label}</span>
	{@render children()}
</label>

<style>
	.field {
		display: grid;
		grid-template-columns: minmax(6rem, 1fr) minmax(0, 2fr);
		align-items: center;
		gap: var(--gap-lg);
		padding-block: var(--gap-sm);
		min-block-size: var(--gap-4xl);
		border-block-end: var(--border-w-thin) solid var(--hue-z0-border);
	}
	.name {
		font-size: var(--text-md);
		line-height: var(--leading-ui);
		color: var(--hue-z0-muted);
	}
	.name::first-letter {
		text-transform: uppercase;
	}
	.field :global(input) {
		inline-size: 100%;
		font-family: var(--ff-sans);
		font-size: var(--text-md);
		line-height: var(--leading-ui);
		font-variant-numeric: tabular-nums;
		text-align: end;
		padding: var(--gap-sm) 0;
		border: 0;
		background: transparent;
		color: var(--hue-white);
		color-scheme: dark;
		appearance: textfield;
	}
	.field :global(input::-webkit-inner-spin-button) {
		appearance: none;
	}
</style>
