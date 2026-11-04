<!-- Training prototype: Drydown review page. The brand, fragrance, reviewer and copy are invented, and the images are placeholders. Deleted when training graduates. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import './drydown-tokens.css';
	import ScoreMeter from './ScoreMeter.svelte';
	import Starburst from './Starburst.svelte';

	const stages = [
		{
			name: 'First',
			time: '0 to 20 minutes',
			ring: 'dots',
			dominant: 'Quince',
			notes: ['Bergamot', 'Pink pepper', 'Green pear']
		},
		{
			name: 'Middle',
			time: '20 minutes to 3 hours',
			ring: 'teardrops',
			dominant: 'Fig leaf',
			notes: ['Iris', 'Black tea', 'Violet leaf']
		},
		{
			name: 'Final',
			time: '3 hours onward',
			ring: 'diamonds',
			dominant: 'Smoked cedar',
			notes: ['Vetiver', 'Ambrette', 'Tonka']
		}
	] as const;

	const subScores = [
		{ name: 'Opening', score: 7.5 },
		{ name: 'Heart', score: 9 },
		{ name: 'Drydown', score: 9.5 },
		{ name: 'Longevity', score: 8.5 },
		{ name: 'Projection', score: 6.5 }
	];
	const finalScore = subScores.reduce((sum, { score }) => sum + score, 0) / subScores.length;

	const wearDetails = [
		['Weather', '11°C, light rain'],
		['Humidity', '82%'],
		['Occasion', 'Market, then dinner out'],
		['Applied', '4 sprays, neck and chest'],
		['Lasted', 'About 9 hours']
	];

	const nav = ['Discover', 'Houses', 'Journal'];
	const footerLinks = ['About', 'Guidelines', 'Privacy'];

	let shareLabel = $state('Share');

	async function copyPageLink() {
		await navigator.clipboard.writeText(window.location.href);
		shareLabel = 'Link copied';
	}
</script>

<svelte:head>
	<title>Late Orchard, reviewed by Imani Okafor | Drydown</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600&display=swap"
	/>
</svelte:head>

<div class="page">
	<header class="band">
		<nav class="top" aria-label="Main">
			<a class="logo" href={resolve('/training/drydown')}>
				<span class="logo-mark"><Starburst /></span>
				Drydown
			</a>
			<ul class="links">
				{#each nav as item (item)}
					<li><a href={resolve('/training/drydown')}>{item}</a></li>
				{/each}
			</ul>
		</nav>
	</header>

	<main>
		<section class="band stages" aria-label="The fragrance over time">
			{#each stages as stage (stage.name)}
				<figure class="stage-card">
					<div class="stage-ring"><Starburst rings={[stage.ring]} /></div>
					<figcaption>
						<span>{stage.name}</span>
						<span class="stage-scent">{stage.dominant}</span>
					</figcaption>
				</figure>
			{/each}
		</section>

		<section class="band title">
			<div>
				<p class="maker">Halden &amp; Vray, 2025</p>
				<h1>Late Orchard</h1>
			</div>
			<div class="final-score">
				<ScoreMeter
					score={finalScore}
					rays={50}
					label="Final score {finalScore.toFixed(1)} out of 10"
				/>
				<p aria-hidden="true">{finalScore.toFixed(1)}</p>
			</div>
		</section>

		<section class="band notes" aria-label="Notes at each stage">
			{#each stages as stage (stage.name)}
				<div>
					<h2>{stage.name} notes</h2>
					<p class="stage-time">{stage.time}</p>
					<ul class="tags">
						<li data-dominant="true">{stage.dominant}</li>
						{#each stage.notes as note (note)}
							<li>{note}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</section>

		<section class="band reading">
			<div class="review">
				<div class="byline">
					<p>
						<strong>Imani Okafor</strong><br />
						<span class="quiet">Worn Saturday, 17 October 2026</span>
					</p>
					<div class="actions">
						<button type="button">Edit</button>
						<button type="button" onclick={copyPageLink} aria-live="polite">{shareLabel}</button>
					</div>
				</div>
				<h2 class="pull">Starts as a bowl of fruit, ends as a coat by the fire.</h2>
				<div class="body">
					<p>
						The first twenty minutes nearly lost me. The quince is bright and slightly waxy, and
						with the pink pepper on top it reads closer to a good hand soap than a perfume. If you
						test this on paper and walk away, you'll think it's pleasant and forget it by lunch.
					</p>
					<p>
						Then the rain did it a favor. Somewhere around the market the fruit thinned out and fig
						leaf came through, green and milky, with iris sitting cold underneath. The black tea is
						faint, but it keeps the whole thing dry. This stretch is why I bought a bottle.
					</p>
					<p>
						By dinner it had become something else: cedar with a little smoke, vetiver, and a skin
						note from the ambrette that had my partner leaning in to ask what I had on. It stays
						close from here, so anyone wanting a room-filler should look elsewhere. Nine hours later
						I could still find it on my scarf.
					</p>
				</div>
			</div>

			<aside class="facts">
				<h2>The day it was worn</h2>
				<dl>
					{#each wearDetails as [term, value] (term)}
						<div>
							<dt>{term}</dt>
							<dd>{value}</dd>
						</div>
					{/each}
				</dl>

				<h2>Behind the {finalScore.toFixed(1)}</h2>
				<ul class="sub-scores">
					{#each subScores as { name, score } (name)}
						<li>
							<span class="sub-meter">
								<ScoreMeter {score} rays={20} label="{name} {score} out of 10" />
							</span>
							<span>{name}</span>
							<span class="sub-value" aria-hidden="true">{score.toFixed(1)}</span>
						</li>
					{/each}
				</ul>
				<p class="quiet">The final score is the average of these five.</p>
			</aside>
		</section>
	</main>

	<footer>
		<div class="footer-inner">
			<div class="footer-logo">
				<span class="footer-mark"><Starburst /></span>
				Drydown
			</div>
			<ul class="links">
				{#each footerLinks as item (item)}
					<li><a href={resolve('/training/drydown')}>{item}</a></li>
				{/each}
			</ul>
		</div>
	</footer>
</div>

<style>
	.page {
		font-family: var(--drydown-ff-body);
		font-size: var(--text-md);
		line-height: var(--leading-loose);
		color: var(--hue-z0-fg);
		background: var(--hue-z0-bg);
	}

	.band,
	.footer-inner {
		max-width: var(--page-max);
		margin-inline: auto;
		padding-inline: var(--gap-3xl);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	h1,
	h2,
	p,
	dl,
	dd,
	figure {
		margin: 0;
	}

	/* suede's default p line height would override the role set on each block. */
	p {
		line-height: inherit;
	}

	h2 {
		font-size: var(--text-md);
		line-height: var(--leading-loose);
		font-weight: 600;
		font-family: inherit;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.quiet,
	.stage-time {
		color: var(--hue-z0-muted);
	}

	/* Chrome */
	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--gap-lg);
		padding-block: var(--gap-xl);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		font-family: var(--ff-didone-display), serif;
		font-size: var(--text-3xl);
		line-height: var(--leading-ui);
	}

	.logo-mark {
		display: block;
		width: 2.25rem;
		aspect-ratio: 1;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-xl);
		line-height: var(--leading-ui);
	}

	/* Image cards */
	.stages {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--gap-lg);
	}

	.stage-card {
		position: relative;
		display: grid;
		place-items: center;
		aspect-ratio: 4 / 5;
		color: var(--hue-white);
		background: var(--hue-stone-600);
	}

	/* Placeholders darken in step with the fragrance. */
	.stage-card:nth-child(2) {
		background: var(--hue-stone-700);
	}

	.stage-card:nth-child(3) {
		background: var(--hue-stone-900);
	}

	.stage-ring {
		width: 72%;
		aspect-ratio: 1;
	}

	figcaption {
		position: absolute;
		inset-inline: var(--gap-lg);
		inset-block-end: var(--gap-lg);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--gap-xs) var(--gap-lg);
		line-height: var(--leading-ui);
	}

	.stage-scent {
		font-family: var(--drydown-ff-headline);
		font-size: var(--text-xl);
	}

	/* Name and final score */
	.title {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--gap-2xl);
		padding-block: var(--gap-4xl);
	}

	.maker {
		font-size: var(--text-xl);
		line-height: var(--leading-tight);
		margin-block-end: var(--gap-md);
	}

	h1 {
		font-family: var(--drydown-ff-headline);
		font-size: clamp(var(--text-7xl), 11vw, 10rem);
		font-weight: 400;
		line-height: 0.95;
		letter-spacing: -0.02em;
	}

	.final-score {
		position: relative;
		display: grid;
		place-items: center;
		width: clamp(12rem, 22vw, 20rem);
		aspect-ratio: 1;
	}

	.final-score > :global(svg) {
		position: absolute;
		inset: 0;
	}

	.final-score p {
		font-family: var(--drydown-ff-headline);
		font-size: var(--text-6xl);
		line-height: var(--leading-ui);
	}

	/* Notes */
	.notes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--gap-2xl) var(--gap-lg);
		padding-block: var(--gap-2xl);
		border-block: 1px solid var(--hue-z0-border);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-sm);
		margin-block-start: var(--gap-md);
	}

	.tags li {
		padding: var(--gap-sm) var(--gap-md);
		font-size: var(--text-sm);
		line-height: var(--leading-ui);
		border: 1px solid var(--hue-z0-border);
		border-radius: var(--radius-full);
	}

	.tags li[data-dominant='true'] {
		color: var(--hue-z0-bg);
		background: var(--hue-z0-fg);
		border-color: var(--hue-z0-fg);
	}

	/* Review and the facts behind it */
	.reading {
		display: grid;
		grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
		gap: var(--gap-4xl);
		padding-block: var(--gap-4xl) var(--gap-5xl);
	}

	.byline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--gap-lg);
	}

	.actions {
		display: flex;
		gap: var(--gap-sm);
	}

	button {
		padding: var(--gap-md) var(--gap-lg);
		font: inherit;
		line-height: var(--leading-ui);
		color: inherit;
		cursor: pointer;
		background: none;
		border: 1px solid var(--hue-z0-divider);
		border-radius: var(--radius-full);
	}

	button:hover {
		background: var(--hue-z1-bg);
	}

	.pull {
		margin-block: var(--gap-3xl) var(--gap-2xl);
		font-family: var(--drydown-ff-headline);
		font-size: var(--text-5xl);
		font-weight: 400;
		line-height: var(--leading-tight);
	}

	.body {
		display: grid;
		gap: var(--leading-loose);
		max-width: 38rem;
		font-size: var(--text-lg);
		line-height: var(--leading-loose);
	}

	.facts {
		display: grid;
		align-content: start;
		gap: var(--gap-lg);
	}

	.facts h2:not(:first-child) {
		margin-block-start: var(--gap-2xl);
	}

	dl > div {
		display: flex;
		justify-content: space-between;
		gap: var(--gap-lg);
		padding-block: var(--gap-sm);
		border-block-start: 1px solid var(--hue-z0-border);
	}

	dd {
		text-align: end;
	}

	dt {
		color: var(--hue-z0-muted);
	}

	.sub-scores li {
		display: flex;
		align-items: center;
		gap: var(--gap-md);
		padding-block: var(--gap-xs);
	}

	.sub-meter {
		display: block;
		width: 2.75rem;
		aspect-ratio: 1;
	}

	.sub-value {
		margin-inline-start: auto;
		font-family: var(--drydown-ff-headline);
		font-size: var(--text-xl);
		line-height: var(--leading-ui);
	}

	/* Closing band */
	footer {
		color: var(--hue-z1-fg);
		background: var(--hue-z1-bg);
		border-block-start: 1px solid var(--hue-z0-border);
	}

	.footer-inner {
		display: grid;
		gap: var(--gap-3xl);
		padding-block: var(--gap-5xl) var(--gap-2xl);
	}

	.footer-logo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gap-2xl);
		font-family: var(--ff-didone-display), serif;
		font-size: clamp(var(--text-7xl), 15vw, 14rem);
		line-height: var(--leading-ui);
	}

	.footer-mark {
		display: block;
		width: 0.95em;
		aspect-ratio: 1;
	}

	@media (max-width: 56rem) {
		.reading {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	/* Three cards stay readable as a row of tall slivers only so far. */
	@media (max-width: 40rem) {
		.stages {
			grid-template-columns: minmax(0, 1fr);
		}

		.stage-card {
			aspect-ratio: 4 / 3;
		}

		.stage-ring {
			width: 56%;
		}
	}
</style>
