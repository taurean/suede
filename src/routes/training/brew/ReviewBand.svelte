<script lang="ts">
	import type { Snippet } from 'svelte';

	const { heading, children }: { heading: string; children: Snippet } = $props();
</script>

<section class="band">
	<div class="l:grid columns">
		<div class="side">
			{#if heading}<h2 class="heading">{heading}</h2>{/if}
		</div>
		<div class="body">{@render children()}</div>
	</div>
</section>

<style>
	.columns {
		row-gap: var(--gap-lg);
	}
	.band {
		padding-block: var(--gap-3xl);
		border-block-start: var(--border-w-thin) solid var(--hue-z0-border);
	}
	.side,
	.body {
		grid-column: span 12;
	}
	.heading {
		margin: 0;
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		line-height: var(--leading-ui);
		font-weight: 400;
		text-transform: uppercase;
		color: var(--brew-accent);
	}
	@media (min-width: 60rem) {
		.side {
			grid-column: span 3;
		}
		.body {
			grid-column: span 7;
		}
	}
</style>
