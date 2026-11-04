<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & { variant?: 'solid' | 'quiet'; children: Snippet };
	const { variant = 'quiet', children, ...rest }: Props = $props();
</script>

<!-- Route-local because SuedeButton has no neutral variant: it's always blue. -->
<button type="button" {...rest} class="pill u:radius-full" data-variant={variant}>
	{@render children()}
</button>

<style>
	.pill {
		font-family: var(--ff-sans);
		font-size: var(--text-md);
		line-height: var(--leading-ui);
		padding: var(--gap-lg) var(--gap-xl);
		border: var(--border-w-thin) solid var(--hue-z0-divider);
		background: transparent;
		color: var(--hue-z0-fg);
		cursor: pointer;
	}
	.pill[data-variant='solid'] {
		background: var(--hue-white);
		border-color: var(--hue-white);
		color: var(--hue-black);
		font-weight: 500;
	}
	.pill:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
