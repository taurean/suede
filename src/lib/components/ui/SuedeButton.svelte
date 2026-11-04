<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Props = Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'type' | 'disabled'> & {
		type?: HTMLButtonAttributes['type'];
		disabled?: boolean | null;
		children?: Snippet;
	};

	let { href, type = 'button', disabled, children, class: className, ...rest }: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	href={href && !disabled ? href : undefined}
	type={href ? undefined : type}
	disabled={href ? undefined : disabled}
	aria-disabled={href ? disabled : undefined}
	role={href && disabled ? 'link' : undefined}
	tabindex={href && disabled ? -1 : undefined}
	{...rest}
	class={`suede-button u:fs-1${className ? ` ${className}` : ''}`}
>
	{@render children?.()}
</svelte:element>

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
			color 0.15s ease,
			transform 0.05s ease;
	}

	.suede-button:not([href]):hover:not(:disabled):not([aria-disabled='true']) {
		background-color: var(--hue-blue-600);
	}

	.suede-button:not([href]):active:not(:disabled):not([aria-disabled='true']) {
		transform: scale(0.98);
	}

	.suede-button[href] {
		background-color: transparent;
		color: var(--hue-blue-500);
		padding-inline: 0;
		text-decoration: underline;
		text-decoration-thickness: from-font;
		text-underline-offset: 0.2em;
	}

	.suede-button[href]:hover:not(:disabled):not([aria-disabled='true']) {
		color: var(--hue-blue-600);
	}

	.suede-button:disabled,
	.suede-button[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
