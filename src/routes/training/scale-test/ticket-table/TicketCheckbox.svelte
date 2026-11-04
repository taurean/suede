<!-- Training prototype. -->
<script lang="ts">
	import { Checkbox } from 'bits-ui';
	import Icon from './Icon.svelte';

	let {
		checked = $bindable(false),
		label,
		id
	}: { checked?: boolean; label: string; id?: string } = $props();
</script>

<Checkbox.Root bind:checked {id} aria-label={label}>
	{#snippet child({ props })}
		<button {...props} class="box">
			{#if checked}<Icon name="check" size="small" weight="bold" />{/if}
		</button>
	{/snippet}
</Checkbox.Root>

<style>
	.box {
		display: inline-grid;
		place-items: center;
		inline-size: var(--ext-size-icon);
		block-size: var(--ext-size-icon);
		padding: 0;
		border: var(--border-w-thin) solid var(--hue-z2-border);
		border-radius: var(--radius-sm);
		background: var(--ext-surface-raised);
		color: var(--hue-z0-bg);
		vertical-align: middle;
		cursor: pointer;
	}
	.box[data-state='checked'] {
		border-color: var(--hue-z0-fg);
		background: var(--hue-z0-fg);
	}
</style>
