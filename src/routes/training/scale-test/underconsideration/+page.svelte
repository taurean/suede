<!-- Training prototype: type and space test, layout study of a dark editorial studio site. Copy, brand and images are invented. Deleted when training graduates. -->
<script lang="ts">
	import './page.css';
	import Entry, { type EntryData } from './Entry.svelte';
	import NewsColumn from './NewsColumn.svelte';
	import PageFooter from './PageFooter.svelte';
	import SideColumn from './SideColumn.svelte';

	type Section = { heading: string; entries?: EntryData[]; things?: boolean; more?: string };

	const left: Section[] = [
		{
			heading: 'Blogs we Publish',
			entries: [
				{
					title: 'Margin Notes',
					body: 'Short reviews of identity work and the thinking behind it.',
					link: '.../marginnotes'
				},
				{
					title: 'Studio Floor',
					body: 'Profiles of small teams making things.',
					link: '.../studiofloor'
				}
			]
		},
		{
			heading: 'Products we Sell',
			more: 'See all Products',
			entries: [
				{
					title: 'Field Guide (PDF + Print)',
					body: 'A working handbook for presenting creative work with clarity.',
					link: '.../fieldguide',
					thumb: 'tall'
				},
				{
					title: 'Talk Archive',
					body: 'Recordings of every session we have hosted so far.',
					link: 'fieldnote.test/archive',
					thumb: 'grid'
				},
				{
					title: 'Good Objects',
					body: 'A small shop of things that need no further explanation.',
					link: '.../objects',
					thumb: 'grid'
				}
			]
		}
	];
	const right: Section[] = [
		{
			heading: 'Events we Organize',
			entries: [
				{
					title: 'Fieldnote Conference',
					body: 'A two-day gathering about identity work, with practitioners from many disciplines and places.',
					link: 'fieldnoteconf.test',
					meta: ['Next #fieldconf:', 'October 8 – 9, 2027', 'Portland, OR']
				},
				{
					title: 'First Draft',
					body: 'A one-day showcase of early presentations, shown with the clients who sat through them.',
					link: '../firstdraft',
					meta: ['Next #firstdraft:', 'TBD']
				},
				{
					title: 'Studio Floor In-person',
					body: 'A two-day meeting for in-house teams to compare how they plan, make and defend their work.',
					link: '.../studiofloor/live',
					meta: ['Next #floor:', 'March 3 – 4, 2028', 'Austin, TX']
				}
			]
		},
		{ heading: 'Favorite Things we’ve Made', things: true, more: 'See all Things' },
		{
			heading: 'Projects we’ve Concluded',
			more: 'See all Concluded',
			entries: [
				{
					title: 'Paper Trail (2012 – 2018)',
					body: 'A niche blog about receipts, tickets and other forgotten print.',
					link: '.../papertrail'
				},
				{
					title: 'Long Lists (2006 – 2016)',
					body: 'One of our longest-running projects, collecting curious things from around the industry.',
					link: '.../longlists'
				},
				{
					title: 'Proof (2010 – 2015)',
					body: 'An early blog about printed matter and how it gets made.',
					link: '.../proof'
				}
			]
		}
	];
</script>

<svelte:head><title>Fieldnote Bureau</title></svelte:head>

{#snippet column(sections: Section[])}
	<div class="column l:waterfall" data-grid-columns="half">
		{#each sections as section (section.heading)}
			<section class="l:waterfall">
				<h2 class="uc-heading rule">{section.heading}</h2>
				{#each section.entries ?? [] as entry (entry.title)}<Entry {...entry} />{/each}
				{#if section.things}
					<div class="things" aria-hidden="true">
						{#each { length: 6 }, i (i)}<i></i>{/each}
					</div>
				{/if}
				{#if section.more}<a href="#top">{section.more}</a>{/if}
			</section>
		{/each}
	</div>
{/snippet}

<div class="page uc-page" id="top">
	<div class="frame">
		<a class="menu" href="#footer" aria-label="Jump to site links"><i></i><i></i><i></i></a>
		<div class="panel l:grid" data-theme="dark">
			<main class="primary" data-grid-columns="half">
				<h1 class="wordmark">
					<svg viewBox="0 0 476 136" role="img" aria-label="Fieldnote Bureau">
						<text y="132" textLength="476" lengthAdjust="spacingAndGlyphs" font-size="180"
							>FIELDNOTE BUREAU</text
						>
					</svg>
				</h1>
				<div class="directory l:grid">
					{@render column(left)}
					{@render column(right)}
				</div>
			</main>
			<div data-grid-columns="third"><NewsColumn /></div>
			<div data-grid-columns="sixth"><SideColumn /></div>
		</div>
		<PageFooter />
	</div>
</div>

<style>
	.page {
		--top: var(--gap-3xl);
		min-block-size: 100vh;
		padding-block-start: var(--top);
		padding-inline: var(--gap-lg);
		background: var(--hue-neutral-200);
	}
	.frame {
		position: relative;
		max-inline-size: 81rem;
		margin-inline: auto;
	}
	.menu {
		position: absolute;
		inset-block-start: calc(var(--top) * -1);
		inset-inline-end: var(--gap-lg);
		display: grid;
		gap: var(--gap-xs);
		padding: var(--gap-xs);
	}
	.menu {
		z-index: 1;
	}
	.menu i {
		inline-size: var(--gap-xl);
		block-size: var(--gap-xs);
		background: var(--hue-black);
	}
	.panel {
		--grid-gutter: 0;
		background: var(--hue-slate-950);
		color: var(--hue-z1-fg);
	}
	.primary {
		padding: var(--gap-4xl) var(--gap-2xl) var(--gap-4xl) var(--gap-4xl);
	}
	.wordmark {
		padding-block-end: var(--gap-lg);
		border-block-end: var(--border-w-thin) solid var(--hue-signal);
	}
	.wordmark svg {
		display: block;
		inline-size: 87%;
		overflow: visible;
	}
	text {
		fill: var(--hue-signal);
		font-family: var(--ff-industrial-display);
		font-weight: var(--fw-bold);
	}
	.directory {
		--grid-gutter: var(--gap-2xl);
		padding-block-start: var(--gap-3xl);
		padding-inline: 0;
	}
	.column {
		--waterfall-gap: var(--gap-4xl);
		align-self: start;
	}
	/* A waterfall's gap is read on each child, so a nested one sets it on its children. */
	section > :global(*) {
		--waterfall-gap: var(--line);
	}
	.things {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gap-xl);
	}
	.things i {
		aspect-ratio: 110 / 83;
		background: var(--hue-slate-900);
	}
	.rule {
		padding-block-end: calc(var(--line) / 4);
		border-block-end: var(--border-w-thin) solid var(--hue-slate-800);
		color: var(--hue-z1-muted);
	}
	/* Structural change: four columns can't stack by wrapping inside a 12-column grid. */
	@media (max-width: 60rem) {
		.panel > *,
		.directory > :global(*) {
			grid-column: 1 / -1;
		}
		.primary {
			padding-inline: var(--gap-lg);
		}
	}
</style>
