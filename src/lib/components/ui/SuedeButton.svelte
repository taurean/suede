<script lang="ts">
	import { Button, type ButtonRootProps } from 'bits-ui';

	type Props = ButtonRootProps;

	let { href, children, class: klass, ...rest }: Props = $props();
</script>

<Button.Root
	{href}
	{...rest as Record<string, unknown>}
	class={`suede-button u:fs-1${klass ? ` ${klass}` : ''}`}
>
	{@render children?.()}
</Button.Root>

<!-- svelte-ignore css_unused_selector -->
<style>
	.suede-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
		font-family: var(--ff-ui);
		font-weight: 600;
		line-height: 1;
		background-color: var(--hue-blue-500);
		color: white;
		padding: var(--space-sm) var(--space-lg);
		border: 0;
		border-radius: 0.375rem;
		cursor: pointer;
		text-decoration: none;
		transition:
			background-color 0.15s ease,
			transform 0.05s ease;
	}

	.suede-button:hover:not(:disabled):not([aria-disabled='true']) {
		background-color: var(--hue-blue-600);
	}

	.suede-button:active:not(:disabled):not([aria-disabled='true']) {
		transform: scale(0.98);
	}

	.suede-button:disabled,
	.suede-button[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
