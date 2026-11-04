<!-- Training prototype. -->
<script lang="ts">
	import ActionButton from './ActionButton.svelte';
	import Icon from './Icon.svelte';
	import TicketCheckbox from './TicketCheckbox.svelte';

	let { selected = $bindable() }: { selected: boolean[] } = $props();

	const columns = ['Ticket ID', 'Title', 'Assignee', 'Approvers', 'Priority', 'Status'];
	const allSelected = $derived(selected.every(Boolean));
</script>

<table class="ticket-table">
	<colgroup>
		<col class="col-check" /><col class="col-id" /><col /><col class="col-person" /><col
			class="col-person"
		/><col class="col-person" /><col class="col-status" />
	</colgroup>
	<thead>
		<tr>
			<th scope="col">
				<TicketCheckbox
					label="Select all rows"
					bind:checked={() => allSelected, (value) => (selected = selected.map(() => value))}
				/>
			</th>
			{#each columns as column (column)}
				<th scope="col"><ActionButton>{column} <Icon name="updown" /></ActionButton></th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each selected, index (index)}
			<tr>
				<td
					><TicketCheckbox
						label={`Select BUG-14, row ${index + 1}`}
						bind:checked={selected[index]}
					/></td
				>
				<td class="u:fg-muted u:fs-compact">BUG-14</td>
				<td class="title">Ticket link add ticket not working after trying to update links</td>
				<td
					><span class="cell"
						><span class="avatar" aria-hidden="true">M</span><span class="clip"
							>Meryem Karasakal</span
						></span
					></td
				>
				<td><ActionButton><Icon name="person" /> Select</ActionButton></td>
				<td
					><span class="cell"
						><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>Low</span
					></td
				>
				<td><span class="cell"><span class="ring" aria-hidden="true"></span>Open</span></td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.ticket-table {
		inline-size: 100%;
		min-inline-size: 60rem;
		table-layout: fixed;
		border-collapse: collapse;
	}
	.col-check {
		inline-size: 2.6875rem;
	}
	.col-id {
		inline-size: 7.5rem;
	}
	.col-person {
		inline-size: 9.25rem;
	}
	.col-status {
		inline-size: 9.5rem;
	}
	th,
	td {
		padding: 0;
		border-block-end: var(--border-w-thin) solid var(--hue-z1-border);
		text-align: start;
		white-space: nowrap;
	}
	th:first-child,
	td:first-child {
		padding-inline-start: calc(var(--space-sm) * 2);
	}
	th {
		position: sticky;
		inset-block-start: 0;
		z-index: 1;
		block-size: 2.25rem;
		background: var(--hue-z1-bg);
		color: var(--ext-fg-muted);
		font-weight: var(--fw-regular);
	}
	td {
		block-size: var(--ext-size-row);
	}
	.title {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.cell {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding-inline-end: var(--space-sm);
	}
	.clip {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.avatar {
		display: grid;
		flex: none;
		place-items: center;
		inline-size: 1.25rem;
		block-size: 1.25rem;
		border-radius: var(--radius-full);
		background: var(--hue-orange-800);
		color: white;
		font-size: var(--fs-0);
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: var(--space-4xs);
		inline-size: var(--ext-size-icon);
		block-size: 0.75rem;
		padding-inline-start: var(--space-3xs);
	}
	.bars i {
		inline-size: 2.5px;
		background: var(--hue-neutral-300);
	}
	.bars i:nth-child(1) {
		block-size: 40%;
		background: currentColor;
	}
	.bars i:nth-child(2) {
		block-size: 70%;
	}
	.bars i:nth-child(3) {
		block-size: 100%;
	}
	.ring {
		inline-size: var(--ext-size-icon);
		block-size: var(--ext-size-icon);
		border: var(--border-w-thick) solid var(--hue-blue-600);
		border-radius: var(--radius-full);
	}
	th,
	td {
		--action-padding-inline: 0;
	}
	th {
		--action-gap: var(--space-medium);
	}
</style>
