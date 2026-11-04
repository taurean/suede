<!--
	Training prototype. Rendered directly instead of through Bits UI's Button.Root, which has no
	`child` snippet and so forces :global. This keeps what Button.Root does: `a` when given `href`,
	disabled handling for both elements, and removing a disabled link from the tab order. It adds
	one default, type="button", so a button in a form never submits by accident.

	Parents set --action-*, named for the property each feeds, inherited from a block or in
	`style` on one button.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Props = Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'type'> & {
		variant?: 'ghost' | 'quiet' | 'raised' | 'solid' | 'outline' | 'chip' | 'danger' | 'link';
		type?: HTMLButtonAttributes['type'];
		disabled?: boolean | null;
		children?: Snippet;
	};

	let { variant = 'ghost', href, type = 'button', disabled, children, ...rest }: Props = $props();
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
	data-variant={variant}
	class="action-button"
>
	{@render children?.()}
</svelte:element>

<style>
	.action-button {
		display: inline-flex;
		align-items: center;
		gap: var(--action-gap, var(--space-sm));
		inline-size: var(--action-inline-size, auto);
		block-size: var(--action-block-size, var(--ext-size-control));
		padding-inline: var(--action-padding-inline, var(--space-medium));
		border: 0;
		border-radius: var(--radius-md);
		background: transparent;
		color: inherit;
		font: inherit;
		white-space: nowrap;
		cursor: pointer;
	}
	.action-button[data-variant='ghost']:hover,
	.action-button[data-variant='outline']:hover {
		background: var(--hue-z1-bg);
	}
	.action-button[data-variant='quiet'] {
		color: var(--hue-z0-muted);
	}
	.action-button[data-variant='raised'] {
		background: var(--ext-surface-raised);
		box-shadow: var(--shadow-z1);
	}
	.action-button[data-variant='solid'] {
		padding-inline: var(--action-padding-inline, var(--space-sm));
		background: var(--hue-z0-fg);
		color: var(--hue-z0-bg);
		font-weight: var(--fw-medium);
	}
	.action-button[data-variant='outline'] {
		border: var(--border-w-thin) solid var(--hue-z1-border);
	}
	.action-button[data-variant='chip'],
	.action-button[data-variant='danger'] {
		padding-inline: var(--action-padding-inline, calc(var(--space-sm) + var(--space-2xs)));
	}
	.action-button[data-variant='chip'] {
		background: var(--hue-z1-bg);
	}
	.action-button[data-variant='danger'] {
		background: var(--ext-danger);
		color: var(--hue-white);
	}
	.action-button[data-variant='link'] {
		text-decoration: underline;
	}
</style>
