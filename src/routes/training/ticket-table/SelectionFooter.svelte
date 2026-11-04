<!-- Training prototype. -->
<script lang="ts">
	import { Select } from 'bits-ui';
	import ActionButton from './ActionButton.svelte';
	import Icon from './Icon.svelte';

	let { count, total, onDeselect }: { count: number; total: number; onDeselect: () => void } =
		$props();

	let rowsPerPage = $state('30');
</script>

<div class="veil" aria-hidden="true"></div>

{#if count > 0}
	<div class="bar" data-theme="dark" role="toolbar" aria-label="Bulk actions">
		<span class="u:fs-compact">{count} row(s) selected</span>
		<div class="l:repel">
			<ActionButton variant="chip"><span class="ring"></span> Set status</ActionButton>
			<ActionButton variant="chip">Set priority</ActionButton>
			<ActionButton variant="chip"><Icon name="person" /> Assign</ActionButton>
		</div>
		<div class="l:repel">
			<ActionButton variant="danger"><Icon name="trash" /> Delete</ActionButton>
			<ActionButton
				variant="link"
				style="--action-padding-inline: var(--space-sm);"
				onclick={onDeselect}>Deselect</ActionButton
			>
		</div>
	</div>
{/if}

<footer class="l:repel footer">
	<span class="u:fg-muted u:fs-compact">{count} of {total} row(s) selected.</span>
	<div class="l:repel">
		<div>
			<Select.Root type="single" bind:value={rowsPerPage}>
				<Select.Trigger aria-label="Rows per page">
					{#snippet child({ props })}
						<ActionButton
							{...props}
							variant="outline"
							style="--action-gap: var(--space-xs); --action-padding-inline: var(--space-sm);"
						>
							<span class="u:fg-muted">Rows per page:</span>
							{rowsPerPage}
							<Icon name="updown" />
						</ActionButton>
					{/snippet}
				</Select.Trigger>
				<Select.Portal>
					<Select.Content sideOffset={4}>
						{#snippet child({ wrapperProps, props, open })}
							{#if open}
								<div {...wrapperProps}>
									<div {...props} class="rows-menu">
										<Select.Viewport>
											{#each ['10', '30', '50'] as value (value)}
												<Select.Item {value} label={value}>
													{#snippet child({ props: itemProps })}
														<div {...itemProps} class="rows-option">{value}</div>
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
		</div>
		<span class="page u:fg-muted">Page 1 of 7</span>
		<div class="pager">
			<ActionButton aria-label="First page"><Icon name="first" /></ActionButton>
			<ActionButton aria-label="Previous page"><Icon name="chevron-left" /></ActionButton>
			<span class="pager-rule" aria-hidden="true"></span>
			<ActionButton aria-label="Next page"><Icon name="chevron-right" /></ActionButton>
			<ActionButton aria-label="Last page"><Icon name="last" /></ActionButton>
		</div>
	</div>
</footer>

<style>
	.veil {
		position: absolute;
		inset: auto 0 0;
		block-size: 5.75rem;
		background: linear-gradient(
			transparent,
			color-mix(in oklch, var(--ext-surface-raised) 80%, transparent) 60%
		);
		backdrop-filter: blur(var(--space-medium));
		mask-image: linear-gradient(transparent, black 25%);
		pointer-events: none;
	}
	.bar {
		--repel-gap: var(--space-sm);
		inline-size: max-content;
		position: absolute;
		inset-block-end: 3.0625rem;
		inset-inline-start: 50%;
		translate: -50% 0;
		display: flex;
		align-items: center;
		gap: calc(var(--space-sm) + var(--space-lg));
		block-size: var(--ext-size-row);
		padding-inline: calc(var(--space-medium) + var(--space-xs));
		border-radius: var(--radius-lg);
		background: var(--hue-z0-bg);
		color: var(--hue-z0-fg);
		white-space: nowrap;
	}
	.ring {
		inline-size: var(--ext-size-icon);
		block-size: var(--ext-size-icon);
		border: var(--border-w-thick) solid var(--hue-blue-600);
		border-radius: var(--radius-full);
	}
	.footer {
		--repel-gap: var(--space-sm);
		--action-block-size: 1.875rem;
		--action-padding-inline: calc(var(--space-sm) + var(--space-2xs));
		position: absolute;
		inset: auto 0 0;
		flex-wrap: nowrap;
		block-size: 2.9375rem;
		padding-inline: calc(var(--space-sm) * 2);
	}
	.page {
		margin-inline-start: var(--space-sm);
	}
	.pager {
		display: flex;
		border: var(--border-w-thin) solid var(--hue-z0-border);
		border-radius: var(--radius-md);
	}
	.pager-rule {
		border-inline-start: var(--border-w-thin) solid var(--hue-z0-border);
	}
	.rows-menu {
		padding: var(--space-xs);
		border-radius: var(--radius-md);
		background: var(--ext-surface-raised);
		box-shadow: var(--shadow-z2);
	}
	.rows-option {
		padding: var(--space-xs) var(--space-medium);
		cursor: pointer;
	}
	.rows-option[data-highlighted] {
		background: var(--hue-z1-bg);
	}
</style>
