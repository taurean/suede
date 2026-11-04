<!-- Training prototype: type and space test, built from sketches and a brand guide. Review copy is invented. Deleted when training graduates. -->
<script lang="ts">
	import Mark from './Mark.svelte';
	import ScoreMeter from './ScoreMeter.svelte';

	const stages = [
		{
			ring: 'first',
			name: 'First',
			image: 'Bergamot',
			notes: ['Bergamot', 'Pink pepper', 'Cardamom', 'Green fig']
		},
		{
			ring: 'middle',
			name: 'Middle',
			image: 'Iris',
			notes: ['Iris', 'Violet leaf', 'Black tea', 'Orris butter', 'Clary sage']
		},
		{
			ring: 'final',
			name: 'Final',
			image: 'Cedar',
			notes: ['Cedar', 'Vetiver', 'Ambergris', 'Smoked birch']
		}
	] as const;
	const facts = [
		['Worn on', 'October 14, 2026'],
		['Weather', 'Overcast, 12°C'],
		['Humidity', '68%'],
		['Lasted', '9 hours'],
		['Longevity', '8.5'],
		['Projection', '6.5'],
		['Complexity', '9.0'],
		['Value', '7.5']
	];
	const paragraphs = [
		'It opens brighter than I expected, all citrus peel and pepper, and I nearly wrote it off as another clean morning scent. That lasted about twenty minutes.',
		'By lunch the iris had taken over, cool and a little powdery, with black tea underneath that kept it from going sweet. This was the part I kept pulling my sleeve up to smell.',
		'The last few hours are what I’ll come back for. Dry cedar and a thread of smoke, close to the skin, still there when I took off my coat that evening.'
	];
</script>

<svelte:head>
	<title>Drydown</title>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500&display=swap"
	/>
</svelte:head>

<div class="page" data-theme="light">
	<header class="site-header">
		<a class="logo" href="#top" aria-label="Drydown home"
			><span class="logo-mark"><Mark /></span>Drydown</a
		>
		<nav aria-label="Primary">
			<a href="#top">Discover</a>
			<a href="#top">Journal</a>
			<a href="#top">Profile</a>
		</nav>
	</header>

	<main>
		<div class="l:grid" role="group" aria-label="Defining notes">
			{#each stages as stage (stage.ring)}
				<div class="card" data-stage={stage.ring} data-grid-columns="third">
					<span class="card-mark"
						><Mark ring={stage.ring} label={`${stage.name}: ${stage.image}`} /></span
					>
				</div>
			{/each}
		</div>

		<div class="l:grid title-row">
			<div class="title" data-grid-columns="half">
				<h1>Cedar Hour</h1>
				<p>Maison Sample</p>
			</div>
			<div class="wide" data-grid-columns="half"><ScoreMeter score={8.2} /></div>
		</div>

		<section class="l:grid stages" aria-label="Notes by stage">
			{#each stages as stage (stage.ring)}
				<div class="stage" data-grid-columns="third">
					<h2>{stage.name}</h2>
					<ul>
						{#each stage.notes as note (note)}
							<li class="chip u:radius-full">{note}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</section>

		<div class="l:grid details">
			<section class="review l:waterfall wide" data-grid-columns="half" aria-label="Review">
				{#each paragraphs as paragraph (paragraph)}<p>{paragraph}</p>{/each}
			</section>
			<aside class="wide" data-grid-columns="half" aria-label="About this wearing">
				<dl>
					{#each facts as [label, value] (label)}
						<div class="fact">
							<dt>{label}</dt>
							<dd>{value}</dd>
						</div>
					{/each}
				</dl>
				<div class="actions"><a href="#top">Edit</a><a href="#top">Share ↗</a></div>
			</aside>
		</div>
	</main>

	<footer class="site-footer">
		<span class="footer-mark"><Mark label="Drydown" /></span>
		<span class="wordmark" aria-hidden="true">Drydown</span>
	</footer>
</div>

<style>
	.page {
		--grid-max-width: var(--page-max);
		--grid-gutter: var(--gap-lg);
		--line: calc(1em + 0.5rem);
		background: var(--hue-white);
		color: var(--hue-neutral-950);
		font-family: 'Public Sans', var(--ff-sans);
		font-size: var(--text-md);
		line-height: var(--line);
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	p,
	dl,
	dd,
	ul,
	h1,
	h2 {
		margin: 0;
		font-size: inherit;
		font-weight: var(--fw-regular);
		line-height: inherit;
	}

	.site-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gap-md) var(--gap-2xl);
		box-sizing: border-box;
		max-inline-size: var(--page-max);
		margin-inline: auto;
		padding: var(--gap-lg) var(--grid-gutter);
	}
	.logo {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		font-family: var(--ff-didone-display);
		font-size: var(--text-2xl);
		line-height: var(--leading-ui);
	}
	.logo-mark {
		inline-size: 1.25em;
	}
	nav {
		display: flex;
		gap: var(--gap-xl);
		line-height: var(--leading-ui);
	}

	/* Stand-ins for the scent photos: they hold the space, and each mark sits dead centre. */
	.card {
		display: grid;
		place-items: center;
		aspect-ratio: 3 / 4;
		border-radius: var(--radius-lg);
		background: var(--hue-stone-700);
		color: var(--hue-white);
	}
	.card[data-stage='middle'] {
		background: var(--hue-mauve-800);
	}
	.card[data-stage='final'] {
		background: var(--hue-stone-900);
	}
	.card-mark {
		inline-size: 45%;
	}

	.title-row {
		align-items: end;
		row-gap: var(--line);
		margin-block-start: calc(var(--line) * 2);
	}
	h1 {
		font-family: var(--ff-didone-display);
		font-size: var(--text-5xl);
		line-height: var(--leading-tight);
	}
	.title p {
		color: var(--hue-neutral-700);
	}

	.stages {
		row-gap: var(--line);
		margin-block-start: var(--line);
		padding-block-start: var(--line);
	}
	.stage {
		padding-block-start: calc(var(--line) / 2);
		border-block-start: var(--border-w-thin) solid var(--hue-neutral-950);
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-sm);
		margin-block-start: calc(var(--line) / 2);
		padding: 0;
		list-style: none;
	}
	.chip {
		padding: var(--gap-sm) var(--gap-md);
		border: var(--border-w-thin) solid var(--hue-neutral-300);
		font-size: var(--text-sm);
		line-height: var(--leading-ui);
	}

	.details {
		--waterfall-gap: var(--line);
		row-gap: calc(var(--line) * 2);
		margin-block-start: calc(var(--line) * 3);
	}
	.review {
		font-size: var(--text-lg);
		line-height: calc(1em + 0.625rem);
		max-inline-size: 36em;
	}
	/* The element reset above outranks l:waterfall's layer, so this column sets its own gap. */
	.review p + p {
		margin-block-start: var(--line);
	}
	.fact {
		display: flex;
		justify-content: space-between;
		gap: var(--gap-lg);
		padding-block: calc(var(--line) / 4);
		border-block-end: var(--border-w-thin) solid var(--hue-neutral-200);
	}
	dt {
		color: var(--hue-neutral-700);
	}
	.actions {
		display: flex;
		gap: var(--gap-xl);
		margin-block-start: var(--line);
	}

	/* The wordmark fills the page, so its size follows the footer's width instead of a text step. */
	.site-footer {
		container-type: inline-size;
		display: flex;
		align-items: center;
		gap: 3cqi;
		box-sizing: border-box;
		max-inline-size: var(--page-max);
		margin: var(--gap-5xl) auto 0;
		padding: 0 var(--grid-gutter) var(--gap-3xl);
	}
	.footer-mark {
		inline-size: 17cqi;
	}
	.wordmark {
		font-family: var(--ff-didone-display);
		font-size: 19cqi;
		line-height: var(--leading-ui);
	}

	/* The grid keeps its 12 columns. Narrow screens only change how many each child spans. */
	@media (max-width: 48rem) {
		.title,
		.wide,
		.stage {
			grid-column: span 12;
		}
	}
</style>
