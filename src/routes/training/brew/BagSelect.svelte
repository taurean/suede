<script lang="ts">
	import { Select } from 'bits-ui';

	type Item = { value: string; label: string };
	type Props = { value: string; items: Item[]; label: string };
	let { value = $bindable(), items, label }: Props = $props();
</script>

<Select.Root type="single" bind:value {items}>
	<Select.Trigger>
		{#snippet child({ props })}
			<button {...props} class="row" aria-label={label}>
				<span class="name">{label}</span>
				<span>{items.find((i) => i.value === value)?.label}</span>
			</button>
		{/snippet}
	</Select.Trigger>
	<Select.Portal>
		<Select.Content sideOffset={4}>
			{#snippet child({ props, wrapperProps, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} class="menu" data-theme="dark">
							<Select.Viewport>
								{#each items as item (item.value)}
									<Select.Item value={item.value} label={item.label}>
										{#snippet child({ props: itemProps })}
											<div {...itemProps} class="item">{item.label}</div>
										{/snippet}
									</Select.Item>
								{/each}
							</Select.Viewport>
						</div>
					</div>
				{/if}
			{/snippet}
		</Select.Content>
	</Select.Portal>
</Select.Root>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		inline-size: 100%;
		min-block-size: var(--gap-4xl);
		padding: var(--gap-sm) 0;
		font-family: var(--ff-sans);
		font-size: var(--text-md);
		line-height: var(--leading-ui);
		background: transparent;
		border: 0;
		border-block-end: var(--border-w-thin) solid var(--hue-z0-border);
		color: var(--hue-white);
		cursor: pointer;
	}
	.name {
		color: var(--hue-z0-muted);
	}
	.menu {
		min-inline-size: var(--bits-select-anchor-width);
		padding: var(--gap-xs);
		background: var(--hue-z2-bg);
		color: var(--hue-z2-fg);
		border: var(--border-w-thin) solid var(--hue-z2-border);
		border-radius: var(--radius-md);
	}
	.item {
		padding: var(--gap-md);
		font-family: var(--ff-sans);
		font-size: var(--text-md);
		line-height: var(--leading-ui);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.item[data-highlighted] {
		background: var(--brew-accent);
		color: var(--hue-black);
	}
</style>
