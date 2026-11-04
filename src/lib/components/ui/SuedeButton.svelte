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

<!-- A disabled link keeps its link role and styling, but loses its href so it can't be followed. -->
<svelte:element
	this={href ? 'a' : 'button'}
	href={href && !disabled ? href : undefined}
	type={href ? undefined : type}
	disabled={href ? undefined : disabled}
	aria-disabled={href ? disabled : undefined}
	role={href && disabled ? 'link' : undefined}
	tabindex={href && disabled ? -1 : undefined}
	{...rest}
	class={`suede-button${className ? ` ${className}` : ''}`}
>
	{@render children?.()}
</svelte:element>

<style>
	.suede-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--gap-xs);
		font-family: var(--ff-ui);
		font-size: var(--text-sm);
		font-weight: var(--fw-semibold);
		line-height: var(--leading-ui);
		background-color: var(--hue-blue-500);
		color: var(--hue-white);
		padding: var(--gap-sm) var(--gap-lg);
		border: 0;
		border-radius: var(--radius-md);
		cursor: pointer;
		text-decoration: none;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			transform 0.05s ease;
	}

	button.suede-button:hover:not(:disabled) {
		background-color: var(--hue-blue-600);
	}

	button.suede-button:active:not(:disabled) {
		transform: scale(0.98);
	}

	a.suede-button {
		background-color: transparent;
		color: var(--hue-blue-500);
		padding-inline: 0;
		text-decoration: underline;
		text-decoration-thickness: from-font;
		text-underline-offset: 0.2em;
	}

	a.suede-button:hover:not([aria-disabled='true']) {
		color: var(--hue-blue-600);
	}

	.suede-button:disabled,
	.suede-button[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
