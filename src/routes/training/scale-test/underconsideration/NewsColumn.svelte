<!-- Training prototype. -->
<script lang="ts">
	const news = [
		{
			date: 'March 2024',
			items: [
				[
					'Jury Duty',
					'Sam will serve on the jury for a sample grant program that gives small studios time to try something new.'
				]
			]
		},
		{
			date: 'August 2023',
			items: [
				[
					'The Second Look',
					'Introducing a podcast that goes deeper into recently reviewed projects, with the designers and sometimes their clients, covering the context and the decisions behind the work.'
				]
			]
		},
		{
			date: 'January 2023',
			items: [
				['Lectern', 'Alex will be speaking at a sample event on January 19, 2023, in Lisbon.']
			]
		},
		{
			date: 'June 2022',
			items: [
				['Letterforms', 'Alex will be speaking at a type conference on June 2 – 3, in Chicago.']
			]
		},
		{
			date: 'February 2022',
			items: [
				['Shelf Life', 'Alex will be speaking about packaging on February 8 – 10 in Denver.'],
				['Shelf Awards', 'Alex will serve on the jury of this year’s awards.']
			]
		}
	];
</script>

<section class="news l:waterfall">
	<div>
		<a class="headline" href="#top">Headline news ▸</a>
		<div class="feature" aria-hidden="true"></div>
		<p class="caption">Speakers announced for the next Fieldnote Conference</p>
	</div>
	<h2 class="uc-heading rule">News</h2>
	{#each news as group (group.date)}
		<h3 class="date rule">{group.date}</h3>
		{#each group.items as [title, body] (title)}
			<div class="story">
				<h4>{title}</h4>
				<p>{body}</p>
			</div>
		{/each}
	{/each}
	<a href="#top">See all News</a>
</section>

<style>
	.news {
		/* Keeps the image's negative margin from collapsing through and moving the whole column. */
		display: flow-root;
		--waterfall-gap: calc(var(--line) / 2);
		block-size: 100%;
		box-sizing: border-box;
		padding: 0 var(--gap-2xl) var(--gap-4xl);
		/* The slate scale stops at 19% lightness, and this column sits a step below it. */
		background: color-mix(in oklch, var(--hue-slate-950) 55%, var(--hue-black));
		color: var(--hue-z0-fg);
	}
	/* The column continues above the panel as a faint band, which separates the link from the image. */
	.news::before {
		content: '';
		display: block;
		block-size: var(--top);
		margin-block-start: calc(var(--top) * -1);
		margin-inline: calc(var(--gap-2xl) * -1);
		background: color-mix(in oklch, var(--hue-black) 8%, transparent);
	}
	.headline {
		position: absolute;
		inset-block-start: calc(var(--top) * -1);
		inset-inline-end: 50%;
		display: flex;
		align-items: center;
		block-size: var(--top);
		padding-inline-end: var(--gap-lg);
		color: var(--hue-neutral-950);
		line-height: var(--leading-ui);
		text-decoration: none;
	}
	.feature {
		aspect-ratio: 341 / 236;
		margin-block-start: calc(var(--top) * -1);
		background: var(--hue-slate-800);
	}
	.caption {
		margin-block-start: calc(var(--line) / 2);
		padding-block-start: var(--gap-xs);
		border-block-start: var(--border-w-thin) solid currentColor;
	}
	.rule {
		padding-block-end: calc(var(--line) / 4);
		border-block-end: var(--border-w-thin) solid var(--hue-slate-800);
	}
	.date {
		color: var(--hue-z0-muted);
	}
	.story {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--gap-lg);
		padding-block-end: calc(var(--line) / 2);
	}
	h4 {
		flex: 1 1 6rem;
	}
	.story p {
		flex: 3 1 12rem;
		min-inline-size: 0;
	}
</style>
