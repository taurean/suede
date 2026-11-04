<!-- Training prototype: design-training round "ticket-table". Deleted when training graduates. -->
<script lang="ts">
	import './suede-extensions.css';
	import ActionButton from './ActionButton.svelte';
	import Icon from './Icon.svelte';
	import SelectionFooter from './SelectionFooter.svelte';
	import Sidebar from './Sidebar.svelte';
	import TicketCheckbox from './TicketCheckbox.svelte';
	import TicketTable from './TicketTable.svelte';

	const total = 147;
	const initiallyChecked = [1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1];
	// The reference counts 73 selected across pages, more than this one page shows.
	const selectedOnOtherPages = 73 - initiallyChecked.filter(Boolean).length;

	let selected = $state(initiallyChecked.map(Boolean));
	let othersCleared = $state(false);

	const count = $derived(
		selected.filter(Boolean).length + (othersCleared ? 0 : selectedOnOtherPages)
	);

	function setAll(value: boolean) {
		selected = selected.map(() => value);
		othersCleared = !value;
	}
</script>

<svelte:head><title>Tickets</title></svelte:head>

<div class="window u:ff-ui">
	<header class="l:repel titlebar">
		<div class="l:repel">
			<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
			<ActionButton
				style="--action-gap: var(--gap-xs); --action-padding-inline: var(--gap-md) var(--gap-xs);"
				aria-label="Toggle sidebar"
			>
				<Icon name="panel" /><Icon name="chevron-down" />
			</ActionButton>
			<ActionButton aria-label="Back"><Icon name="chevron-left" /></ActionButton>
		</div>
		<div class="l:repel">
			<ActionButton aria-label="Downloads"><Icon name="download" /></ActionButton>
			<ActionButton aria-label="Share"><Icon name="share" /></ActionButton>
			<ActionButton aria-label="New tab"><Icon name="plus" /></ActionButton>
		</div>
	</header>

	<Sidebar />

	<main class="panel">
		<div class="l:repel panel-head">
			<h1 class="heading ext:text-md"><Icon name="inbox" /> Tickets</h1>
			<ActionButton variant="solid"><Icon name="plus" /> New ticket</ActionButton>
		</div>
		<div class="l:repel toolbar">
			<div class="l:repel">
				<label class="l:repel">
					<TicketCheckbox label="Select all" bind:checked={() => selected.every(Boolean), setAll} />
					<span>Select all</span>
				</label>
				<ActionButton variant="outline"><Icon name="filter" /> Filters</ActionButton>
			</div>
			<ActionButton variant="outline"><Icon name="sliders" /> View options</ActionButton>
		</div>
		<div class="scroller"><TicketTable bind:selected /></div>
		<SelectionFooter {count} {total} onDeselect={() => setAll(false)} />
	</main>
</div>

<style>
	.window {
		position: fixed;
		inset: 0;
		overflow: hidden;
		/* Backgrounds reach the viewport edge. Past 1440px only the content stops and centres. */
		--bleed: max(0px, (100vw - var(--page-max)) / 2);
		padding-inline: var(--bleed);
		font-size: var(--text-sm);
		line-height: var(--leading-ui);
		display: grid;
		grid-template: auto minmax(0, 1fr) / auto minmax(0, 1fr);
		background: var(--hue-z1-bg);
		color: var(--hue-z1-fg);
	}
	.titlebar {
		--repel-gap: 0;
		grid-column: 1 / -1;
		margin-inline: calc(var(--bleed) * -1);
		flex-wrap: nowrap;
		--ext-size-icon: 1.125rem;
		padding: var(--gap-sm) calc(var(--bleed) + var(--gap-lg));
		border-block-end: var(--border-w-thin) solid var(--hue-z1-border);
		background: var(--ext-surface-raised);
	}
	.lights {
		display: flex;
		gap: var(--gap-sm);
		margin-inline-end: var(--gap-lg);
	}
	.lights i {
		inline-size: 0.75rem;
		block-size: 0.75rem;
		border-radius: var(--radius-full);
		background: var(--ext-danger);
	}
	.lights i:nth-child(2) {
		background: var(--hue-amber-500);
	}
	.lights i:nth-child(3) {
		background: var(--hue-green-500);
	}
	.panel {
		position: relative;
		display: flex;
		flex-direction: column;
		min-block-size: 0;
		margin: var(--gap-md);
		overflow: hidden;
		border: var(--border-w-thin) solid var(--hue-z0-border);
		border-radius: var(--radius-lg);
		background: var(--ext-surface-raised);
	}
	.toolbar {
		--repel-gap: var(--gap-sm);
	}
	.panel-head,
	.toolbar {
		flex: none;
		padding: var(--gap-md) var(--gap-lg);
		border-block-end: var(--border-w-thin) solid var(--hue-z0-border);
	}
	.heading {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		margin: 0;
		font-weight: var(--fw-regular);
	}
	.scroller {
		flex: 1;
		min-block-size: 0;
		overflow: auto;
	}
</style>
