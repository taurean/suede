<!-- Training prototype. -->
<script lang="ts">
	import { Collapsible } from 'bits-ui';
	import ActionButton from './ActionButton.svelte';
	import Icon from './Icon.svelte';

	const primary = [
		{ name: 'Tickets', icon: 'inbox', badge: 17 },
		{ name: 'Analytics', icon: 'chart' },
		{ name: 'Knowledge', icon: 'library' },
		{ name: 'Request types', icon: 'requests' },
		{ name: 'Members', icon: 'users' }
	] as const;
	const groups = [
		{
			title: 'Views',
			items: [
				['🏀', 'John'],
				['🎃', 'Taylor'],
				['🔮', 'Eric'],
				['🍲', 'Batuhan'],
				['👾', 'Jeff'],
				['🐣', 'Kevin']
			]
		},
		{
			title: 'Queues',
			items: [
				['🧙', 'Knowledge'],
				['🔗', 'Usability'],
				['💰', 'Features'],
				['🎨', 'Design'],
				['🧠', 'AI-Stack'],
				['💬', 'Slack']
			]
		}
	];
	const secondary = [
		{ name: 'Support', icon: 'lifebuoy' },
		{ name: 'Feedback', icon: 'message' },
		{ name: 'Invite teammates', icon: 'invite' }
	] as const;
</script>

<nav class="sidebar" aria-label="Workspace">
	<div class="l:repel workspace">
		<ActionButton>
			<span class="logo" aria-hidden="true">P</span> Product Design <Icon name="updown" />
		</ActionButton>
		<ActionButton variant="quiet" aria-label="Collapse sidebar"
			><Icon name="collapse" /></ActionButton
		>
	</div>

	<div class="search">
		<ActionButton variant="raised">
			<span class="l:repel row">
				<span class="l:repel"><Icon name="search" /> Search</span>
				<kbd>⌘ K</kbd>
			</span>
		</ActionButton>
	</div>

	<ul class="list">
		{#each primary as item, index (item.name)}
			<li>
				<ActionButton
					variant={index === 0 ? 'raised' : 'ghost'}
					aria-current={index === 0 ? 'page' : undefined}
				>
					<span class="l:repel row">
						<span class="l:repel"><Icon name={item.icon} /> {item.name}</span>
						{#if 'badge' in item}<span class="badge">{item.badge}</span>{/if}
					</span>
				</ActionButton>
			</li>
		{/each}
	</ul>

	{#each groups as group (group.title)}
		<Collapsible.Root open>
			<div class="l:repel group-head">
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<ActionButton {...props} variant="quiet">
							<Icon name="chevron-up" size="small" />
							{group.title}
						</ActionButton>
					{/snippet}
				</Collapsible.Trigger>
				<ActionButton variant="quiet" aria-label={`Add to ${group.title}`}>
					<Icon name="plus" />
				</ActionButton>
			</div>
			<Collapsible.Content>
				<ul class="list nested">
					{#each group.items as [emoji, name] (name)}
						<li>
							<ActionButton
								><span class="emoji" aria-hidden="true">{emoji}</span> {name}</ActionButton
							>
						</li>
					{/each}
				</ul>
			</Collapsible.Content>
		</Collapsible.Root>
	{/each}

	<ul class="list secondary-nav">
		{#each secondary as item (item.name)}
			<li><ActionButton><Icon name={item.icon} /> {item.name}</ActionButton></li>
		{/each}
	</ul>

	<div class="account">
		<ActionButton>
			<span class="l:repel row">
				<span class="l:repel">
					<span class="avatar" aria-hidden="true">B</span>
					<span class="identity">Batuhan Karasakal<small>batuhankrskl@gmail.com</small></span>
				</span>
				<Icon name="updown" />
			</span>
		</ActionButton>
	</div>
</nav>

<style>
	.sidebar {
		--action-inline-size: 100%;
		--action-padding-inline: var(--gap-sm);
		display: flex;
		flex-direction: column;
		block-size: 100%;
		padding: var(--gap-xs) 0 var(--gap-md) var(--gap-sm);
		overflow: hidden;
	}
	.workspace,
	.group-head {
		--action-inline-size: auto;
		flex-wrap: nowrap;
	}
	.workspace {
		--action-gap: var(--gap-xs);
	}
	.group-head {
		margin-block-start: var(--gap-xs);
	}
	.search {
		margin-block: var(--gap-xs) var(--gap-sm);
	}
	.row {
		--repel-gap: var(--gap-sm);
		flex: 1;
		flex-wrap: nowrap;
	}
	.list {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.nested {
		margin-inline-start: var(--gap-md);
		margin-block-end: var(--border-w-thin);
		padding-inline-start: var(--gap-md);
		border-inline-start: var(--border-w-thin) solid var(--hue-z1-border);
	}
	.secondary-nav {
		--action-padding-inline: var(--gap-xs) var(--gap-sm);
		margin-block-start: auto;
	}
	.account {
		margin-block-start: var(--gap-lg);
	}
	.logo {
		display: grid;
		place-items: center;
		inline-size: 1.25rem;
		block-size: 1.25rem;
		border-radius: var(--radius-xs);
		background: var(--hue-z0-fg);
		color: var(--hue-z0-bg);
		font-size: var(--text-xs);
	}
	kbd {
		margin-inline-end: var(--gap-sm);
		color: var(--hue-z1-muted);
		font: inherit;
	}
	.badge {
		padding-inline: var(--gap-xs);
		border-radius: var(--radius-sm);
		background: var(--ext-danger);
		color: var(--hue-white);
	}
	.emoji {
		inline-size: var(--ext-size-icon);
		font-size: var(--text-xs);
	}
	.avatar {
		display: grid;
		place-items: center;
		inline-size: 1.5rem;
		block-size: 1.5rem;
		border-radius: var(--radius-full);
		background: var(--hue-orange-700);
		color: var(--hue-white);
	}
	.identity {
		display: grid;
		line-height: var(--leading-tight);
		text-align: start;
	}
	small {
		color: var(--hue-z1-muted);
		font-size: var(--text-xs);
	}
	/* Structural change: wrapping can't turn a sidebar into a menu. Counted as an exception. */
	@media (max-width: 48rem) {
		.sidebar {
			display: none;
		}
	}
</style>
