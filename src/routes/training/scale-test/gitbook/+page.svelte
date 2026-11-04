<!-- Training prototype: type and space test, homepage layout study. Copy and brand are invented. Deleted when training graduates. -->
<script lang="ts">
	import { Tabs } from 'bits-ui';
	import './extensions.css';

	const glyphs = {
		branch: 'M5 3v10M11 3v3a3 3 0 0 1-3 3H5',
		scan: 'M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4M5 8h6',
		spark: 'M8 2l1.5 4.5L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5z',
		bulb: 'M8 2a4 4 0 0 0-2 7.5V11h4V9.5A4 4 0 0 0 8 2zM6.5 14h3',
		move: 'M2 8h10M9 5l3 3-3 3M14 3v10',
		lock: 'M4 7h8v7H4zM6 7V5a2 2 0 0 1 4 0v2'
	};
	const nav = ['Product', 'Solutions', 'Resources'];
	const logos = ['Northwind', 'Halyard', 'Quarry', 'Tessel', 'Orbit', 'Juniper'];
	const demoTabs = ['Ask anything', 'Reader insights', 'Embed and link', 'Auto updates'];
	const sideGroups = [
		[
			'GETTING STARTED',
			['Welcome', 'First steps', 'Core ideas', 'Performance', 'Workloads', 'Tuning'],
			'bulb'
		],
		[
			'SECURITY',
			['Overview', 'Best practices', 'Hardening', 'Patching', 'Audit logs', 'Incidents'],
			'lock'
		]
	] as const;
	const mockCards = ['Quickstart', 'Security', 'Theming', 'Domains'];
	const assistants = ['Assistant A', 'Assistant B', 'Assistant C'];
	const trackerBars = [
		{ width: '53%', state: 'ok' },
		{ width: '50%', state: 'ok' },
		{ width: '36%', state: 'error' },
		{ width: '19%', state: 'ok' }
	];
	const hubNodes = [
		[120, 70, 240, 98],
		[450, 70, 330, 98],
		[55, 170, 188, 170],
		[510, 170, 379, 170],
		[120, 270, 240, 243],
		[450, 270, 330, 243]
	];
	const pillars = [
		[
			'Write docs right beside your code',
			'Sync a repository, branch, review and merge your pages like any pull request.',
			'Repo sync',
			'branch'
		],
		[
			'Catch stale pages before readers do',
			'Compares your docs with product changes and queues whatever has fallen behind.',
			'Drift checks',
			'scan'
		],
		[
			'Turn your docs into replies',
			'Readers ask a question in place and get an answer grounded in the pages you published.',
			'Reader chat',
			'spark'
		],
		[
			'See what readers miss, then fix it',
			'Shows where people and agents get stuck, and which pages to improve first.',
			'Analytics',
			'bulb'
		]
	] as const;
	const enterpriseLeft = [
		[
			'Guided migration',
			'A specialist moves your content across, trains your team and gets everyone publishing quickly.',
			'move'
		],
		[
			'Granular access',
			'Decide exactly who can read, comment on and change each space, with roles that fit.',
			'lock'
		]
	] as const;
	const enterpriseRight = [
		[
			'Compliance built in',
			'Audit trails, single sign-on and data residency for teams in regulated industries.',
			'lock'
		],
		[
			'Private publishing',
			'Serve docs only to signed-in customers, staff or partners, wherever they read them.',
			'lock'
		]
	] as const;
	const metrics = [
		['Northwind', '2×', 'more search visits'],
		['Halyard', '−30%', 'fewer support tickets'],
		['Quarry', '19 min', 'median review time'],
		['Tessel', '3 days', 'from migration to launch']
	];
	const footer = [
		{
			heading: 'Product',
			lead: 'Pricing',
			columns: [
				['AI tools', ['Drift checks', 'Reader chat', 'Docs analytics']],
				['Connectors', ['Agent server', 'Custom blocks', 'Extensions']],
				['Create', ['Repo sync', 'Private publishing', 'Editor']]
			]
		},
		{
			heading: 'Solutions',
			lead: '',
			columns: [
				['Use case', ['Public docs', 'API docs', 'Help centers', 'Knowledge bases', 'Open source']],
				['Industry', ['Finance', 'Healthcare', 'Security', 'Startups', 'Technology']],
				['Customers', ['Showcase', 'Stories']]
			]
		},
		{
			heading: 'Resources',
			lead: '',
			columns: [
				['Docs', ['Quickstart', 'API reference', 'Developer docs', 'Changelog']],
				['Learn', ['Migration guide', 'Buy or build', 'Agent checks', 'Templates']],
				[
					'Company',
					['About', 'Careers', 'Blog', 'Research', 'Events', 'Videos', 'Newsletter', 'Contact']
				]
			]
		}
	];

	let carousel = $state<HTMLUListElement>();
	let traffic = $state(56.003);
	$effect(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const timer = setInterval(() => (traffic += 0.001), 1200);
		return () => clearInterval(timer);
	});
</script>

<svelte:head><title>Foldline</title></svelte:head>

{#snippet arrow()}
	<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"
		><path d="M3 8h10M9 4l4 4-4 4" /></svg
	>
{/snippet}
{#snippet chevron()}
	<svg class="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"
		><path d="M4 6l4 4 4-4" /></svg
	>
{/snippet}
{#snippet mark()}
	<svg class="icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
		><path d="M8 1l7 4-7 4-7-4zM1 8l7 4 7-4v3l-7 4-7-4z" /></svg
	>
{/snippet}
{#snippet glyph(path: string)}
	<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"
		><path d={path} /></svg
	>
{/snippet}

<div class="page">
	<a class="banner" href="#top"
		>Scheduled maintenance this Saturday. See the status page {@render arrow()}</a
	>

	<header class="site-header wrap" id="top">
		<a class="brand" href="#top">{@render mark()} Foldline</a>
		<nav class="primary-nav" aria-label="Primary">
			{#each nav as item (item)}<a href="#top">{item} {@render chevron()}</a>{/each}
			<a href="#top">Pricing</a>
		</nav>
		<div class="actions">
			<a class="quiet-link" href="#top">Log in</a>
			<a class="pill u:radius-full" data-variant="faint" href="#top">Try it free</a>
			<a class="pill u:radius-full" href="#top">Contact us</a>
		</div>
	</header>

	<main>
		<section class="hero wrap">
			<a class="announce" href="#top"><b>New</b> Drift checks for every space {@render arrow()}</a>
			<h1>Docs that notice when they're wrong. <em>Then repair themselves.</em></h1>
			<p class="lede">Foldline keeps documentation current for readers and for agents</p>
			<div class="cta-row">
				<a class="pill u:radius-full" data-size="large" href="#top">Try it free {@render arrow()}</a
				>
				<a class="pill u:radius-full" data-size="large" data-variant="soft" href="#top"
					>Continue with your repo</a
				>
			</div>
		</section>

		<ul class="logo-strip wrap" aria-label="Example customers">
			{#each logos as logo (logo)}<li>{logo}</li>{/each}
		</ul>

		<section class="demo wrap">
			<div class="art" aria-hidden="true">
				<i class="arc"></i><i class="band" data-side="left"></i><i class="band" data-side="right"
				></i>
			</div>
			<Tabs.Root value={demoTabs[0]}>
				<Tabs.List>
					{#snippet child({ props })}
						<div {...props} class="demo-tabs">
							{#each demoTabs as tab (tab)}
								<Tabs.Trigger value={tab}>
									{#snippet child({ props })}<button {...props} class="demo-tab">{tab}</button
										>{/snippet}
								</Tabs.Trigger>
							{/each}
						</div>
					{/snippet}
				</Tabs.List>
				<div class="window">
					<div class="traffic" aria-hidden="true"><i></i><i></i><i></i></div>
					{#each demoTabs as tab (tab)}
						<Tabs.Content value={tab}>
							{#snippet child({ props })}
								<div {...props} class="window-body">
									<div class="mock-site">
										<div class="mock-top">
											<strong>Sample Co</strong><span class="mock-search">Search…</span><span
												class="mock-button">Sign in</span
											>
										</div>
										<div class="mock-nav">
											<span data-active>Product</span><span>API</span><span>Help center</span><span
												>Changelog</span
											>
										</div>
										<div class="mock-columns">
											<aside class="mock-side">
												{#each sideGroups as [heading, links, icon] (heading)}
													<strong>{heading}</strong>
													{#each links as link (link)}<span
															>{@render glyph(glyphs[icon])} {link}</span
														>{/each}
												{/each}
											</aside>
											<div class="mock-main">
												<small>GETTING STARTED</small>
												<h2>{tab}</h2>
												<p>A sample space showing how a published site looks to its readers.</p>
												<div class="mock-cards">
													{#each mockCards as card (card)}
														<div class="mock-card">
															<div class="mock-card-art">
																<span class="tile">{@render mark()}</span>
															</div>
															<strong>{card}</strong>
															<span>A short sample description.</span>
														</div>
													{/each}
												</div>
											</div>
										</div>
									</div>
									<aside class="mock-chat">
										<strong>Assistant</strong>
										<div class="chat-hello">
											<span class="chat-mark">{@render mark()}</span><strong>Good morning</strong
											><span>What can I help you find?</span>
										</div>
										<span class="chat-suggestion">What can the assistant do?</span>
										<span class="chat-suggestion">How do I add a teammate?</span>
										<span class="chat-suggestion">Where is the API key?</span>
										<span class="chat-field"
											>How do I get started?<small>Based on your context <b>Send</b></small></span
										>
									</aside>
									<a
										class="pill u:radius-full mock-float"
										data-size="large"
										href="#top"
										tabindex="-1">Foldline Assistant {@render arrow()}</a
									>
								</div>
							{/snippet}
						</Tabs.Content>
					{/each}
				</div>
			</Tabs.Root>
		</section>

		<section class="get-started wrap">
			<h2 class="heading-m">Start with your assistant</h2>
			<ul class="assistant-row">
				{#each assistants as assistant (assistant)}<li>
						<a href="#top">{@render mark()} {assistant}</a>
					</li>{/each}
			</ul>
			<p class="setup-line">
				Set up Foldline from your agent <button class="copy">Copy prompt</button>
			</p>
		</section>

		<section class="split wrap">
			<div class="split-text">
				<span class="tracker"><b>Stale page tracker</b><span>{traffic.toFixed(3)}%</span></span>
				<h2 class="heading-m">One stale page becomes a thousand wrong answers</h2>
				<p>
					Products move faster than their docs, and nothing warns you when the two drift apart.
					Foldline spots the gap and proposes a fix before an agent repeats the mistake to everyone.
				</p>
			</div>
			<div class="visual" aria-hidden="true">
				<div class="check-window">
					<div class="traffic-colour"><i></i><i></i><i></i></div>
					{#each trackerBars as bar, i (i)}<span
							class="bar"
							data-state={bar.state}
							style:inline-size={bar.width}
						></span>{/each}
				</div>
				<i class="visual-flare"></i>
				<div class="check-card">{@render mark()}<span>Reviewing pages for errors<i></i></span></div>
			</div>
		</section>

		<section class="split wrap" data-order="reversed">
			<div class="visual" aria-hidden="true">
				<svg class="hub" viewBox="0 0 567 341" fill="none">
					{#each hubNodes as [x, y, ex, ey] (`${x}-${y}`)}
						<path
							d="M{x} {y}H{ex}V{ey}"
							stroke="var(--ext-accent)"
							stroke-dasharray="2 3"
							opacity="0.7"
						/>
					{/each}
					<rect
						x="188"
						y="98"
						width="191"
						height="145"
						rx="10"
						fill="var(--ext-surface)"
						stroke="var(--hue-orange-300)"
						stroke-dasharray="2 3"
					/>
					<path
						d="M283 150l28 15-28 15-28-15zM255 180l28 15 28-15"
						stroke="var(--ext-ink)"
						stroke-width="5"
						stroke-linejoin="round"
					/>
					{#each hubNodes as [x, y] (`node-${x}-${y}`)}
						<rect
							x={x - 24}
							y={y - 36}
							width="48"
							height="74"
							rx="24"
							fill="var(--ext-surface)"
							stroke="var(--ext-line)"
						/>
						<circle cx={x} cy={y - 14} r="16" fill="var(--hue-stone-300)" />
						<circle
							cx={x}
							cy={y + 18}
							r="11"
							fill="var(--hue-emerald-100)"
							stroke="var(--hue-emerald-700)"
						/>
						<path d="M{x - 4} {y + 18}l3 3 5-6" stroke="var(--hue-emerald-700)" />
					{/each}
				</svg>
			</div>
			<div class="split-text">
				<h2 class="heading-m">Readable by agents isn't the same as right for readers</h2>
				<p>
					Formatting pages for machines is the easy part. Foldline also checks that what they find
					can be trusted, so anyone following the steps, person or agent, ends up with the correct
					result.
				</p>
			</div>
		</section>

		<section class="system wrap">
			<h2 class="heading-l">A system built around keeping docs right, not only writing them</h2>
			<div class="diagram" aria-hidden="true">
				<i class="dash" data-at="top"></i><i class="dash" data-at="left"></i><i
					class="dash"
					data-at="right"
				></i>
				<span class="tile" data-at="top">{@render glyph(glyphs.branch)}</span>
				<span class="tile" data-at="left">{@render glyph(glyphs.bulb)}</span>
				<span class="tile" data-at="right">{@render glyph(glyphs.scan)}</span>
				<span class="tile" data-at="bottom">{@render glyph(glyphs.spark)}</span>
				<svg class="cube" viewBox="0 0 150 170" fill="none" stroke="var(--ext-accent)">
					<path d="M75 2l70 40v84l-70 42-70-42V42z" fill="var(--hue-orange-100)" />
					<path d="M75 2l70 40-70 42-70-42z" fill="var(--hue-orange-200)" />
					<path d="M75 20l42 22-42 24-42-24z" fill="var(--ext-surface)" stroke="none" />
					<path d="M75 84v84" />
					<path
						d="M75 28l24 13-24 13-24-13zM51 47l24 13 24-13"
						stroke="var(--ext-ink)"
						stroke-width="4"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<div class="pillars">
				{#each pillars as [title, body, tag, icon] (title)}
					<article class="pillar">
						<span class="tile">{@render glyph(glyphs[icon])}</span>
						<h3>{title}</h3>
						<p>{body}</p>
						<span class="tag">{tag}</span>
					</article>
				{/each}
			</div>
		</section>

		<section class="quote wrap">
			<div class="portrait" aria-hidden="true"><i></i><b>Northwind</b></div>
			<blockquote>
				<p>
					“Sample testimonial: our docs used to be a chore nobody wanted. Now keeping them right
					takes almost no effort, and we finally trust what our readers are told when they ask a
					question. It did exactly what we needed, for them and for us, and writing our reference
					pages got far easier.”
				</p>
				<footer>Placeholder Name, Head of Product, <span>Northwind</span></footer>
				<a class="pill u:radius-full" data-size="large" href="#top">Read the docs</a>
			</blockquote>
		</section>

		<section class="enterprise-section wrap">
			<h2 class="heading-l">Enterprise docs that stay correct at scale</h2>
			<p class="lede">
				Single sign-on, audit trails, access controls and migration help. Made for larger teams with
				stricter requirements.
			</p>
			<a class="pill u:radius-full" data-size="large" href="#top">Book a demo</a>
			<div class="enterprise">
				{#each [enterpriseLeft, enterpriseRight] as column, c (c)}
					<div class="enterprise-column" style:order={c * 2}>
						{#each column as [title, body, icon] (title)}
							<article>
								<span class="tile">{@render glyph(glyphs[icon])}</span>
								<h3>{title}</h3>
								<p>{body}</p>
							</article>
						{/each}
					</div>
				{/each}
				<div class="enterprise-art" aria-hidden="true"><i></i></div>
			</div>
			<h3 class="metrics-title">Results across teams</h3>
			<dl class="metrics">
				{#each metrics as [name, value, label] (name)}
					<div>
						<dt>{name}</dt>
						<dd class="metric-tile">↗</dd>
						<dd class="metric-value">{value}</dd>
						<dd class="metric-label">{label}</dd>
					</div>
				{/each}
			</dl>
		</section>

		<section class="quote wrap">
			<div class="portrait" aria-hidden="true"><i></i><b>Halyard</b></div>
			<blockquote>
				<p>
					“Sample testimonial: connecting our agents to the docs shortened every partner rollout by
					weeks, and it gave our integrators a far quicker path to launch.”
				</p>
				<footer>Placeholder Name, VP of Engineering, <span>Halyard</span></footer>
				<a class="pill u:radius-full" data-size="large" href="#top">Read the story</a>
			</blockquote>
		</section>

		<section class="customers wrap">
			<span class="eyebrow">CUSTOMERS</span>
			<div class="customers-head">
				<h2 class="heading-l">Teams like yours are writing better docs with Foldline</h2>
				<a class="pill u:radius-full" data-size="large" href="#top">View all</a>
			</div>
			<ul class="customer-row" bind:this={carousel}>
				{#each logos as logo (logo)}<li><b>{logo}</b><span class="round">↗</span></li>{/each}
			</ul>
			<div class="carousel-nav">
				<span class="pager" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
				<button
					aria-label="Previous customers"
					onclick={() => carousel?.scrollBy({ left: -344, behavior: 'smooth' })}>←</button
				>
				<button
					aria-label="Next customers"
					onclick={() => carousel?.scrollBy({ left: 344, behavior: 'smooth' })}>→</button
				>
			</div>
		</section>

		<section class="closing">
			<svg
				class="watermark"
				viewBox="0 0 160 160"
				fill="none"
				stroke="currentColor"
				stroke-width="12"
				stroke-linejoin="round"
				aria-hidden="true"><path d="M80 12l68 38-68 38-68-38zM12 88l68 38 68-38" /></svg
			>
			<h2>Correct docs.<br />Better answers.</h2>
			<p>
				Your docs already feed AI tools. Are readers getting the right answers, or the wrong ones?
			</p>
			<div class="cta-row">
				<a class="pill u:radius-full" data-size="large" href="#top">Try it free {@render arrow()}</a
				>
				<a class="pill u:radius-full" data-size="large" data-variant="soft" href="#top"
					>Talk to sales</a
				>
			</div>
		</section>
	</main>

	<footer class="site-footer">
		<div class="wrap">
			<div class="footer-top">
				<a class="brand" href="#top">{@render mark()} Foldline</a>
				<div class="socials" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
			</div>
			<div class="footer-main">
				<div class="footer-links">
					{#each footer as group (group.heading)}
						<nav aria-label={group.heading} class="footer-group">
							<h2>{group.heading}</h2>
							{#if group.lead}<a class="footer-lead" href="#top">{group.lead}</a>{/if}
							<div class="footer-columns">
								{#each group.columns as column (column[0])}
									<div>
										<h3>{column[0]}</h3>
										<ul>
											{#each column[1] as link (link)}<li><a href="#top">{link}</a></li>{/each}
										</ul>
									</div>
								{/each}
							</div>
						</nav>
					{/each}
				</div>
				<aside class="promos">
					<div class="promo" data-tone="accent">
						<span class="promo-mark">{@render glyph(glyphs.spark)}</span>
						<strong>Enterprise</strong>
						<span>Documentation that keeps up with large teams</span>
						<a class="pill u:radius-full" data-size="large" data-variant="light" href="#top"
							>Book a demo {@render arrow()}</a
						>
					</div>
					<div class="promo">
						<i class="promo-logo">Northwind</i>
						<strong>Northwind</strong>
						<span>How one support team rebuilt its help center around Foldline</span>
						<a href="#top">Read the story</a>
					</div>
					<div class="promo">
						<i class="promo-icon"></i>
						<strong>The Docs Accuracy Report</strong>
						<span
							>A sample report on how documentation teams measure and maintain quality across
							products</span
						>
						<a href="#top">Read the report</a>
					</div>
				</aside>
			</div>
			<div class="badges" aria-hidden="true"><i></i><i></i></div>
			<p class="fine">
				© Foldline, a fictional product used for a design exercise.<br />100 Example Street, Sample
				City.
			</p>
			<h2 class="summary-title">Get an AI summary</h2>
			<div class="summary-icons" aria-hidden="true"><i></i><i></i><i></i></div>
			<ul class="legal">
				<li><a href="#top">Terms of service</a></li>
				<li><a href="#top">Privacy statement</a></li>
				<li><a href="#top">Security and compliance</a></li>
				<li><a href="#top">Status</a></li>
			</ul>
		</div>
	</footer>
</div>

<style>
	/* Limits, not sizes: --measure is a cap on the content column and nothing else is fixed. */
	.page {
		--measure: 72.5rem;
		background: var(--ext-surface);
		color: var(--ext-ink);
		overflow-x: clip;
		font-family: var(--ff-sans);
		font-size: var(--text-sm);
		line-height: var(--leading-ui);
	}
	.wrap {
		box-sizing: content-box;
		max-inline-size: var(--measure);
		margin-inline: auto;
		padding-inline: var(--gap-lg);
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	h1,
	h2,
	h3,
	p {
		margin: 0;
		font-weight: var(--fw-regular);
		text-wrap: balance;
	}
	article p,
	article h3 {
		font-family: var(--ff-sans);
	}
	.icon {
		inline-size: 1em;
		block-size: 1em;
		flex: none;
		stroke-width: 1.5;
	}
	.chevron {
		inline-size: 0.75em;
		block-size: 0.75em;
		flex: none;
		opacity: 0.6;
	}
	.heading-m {
		font-size: var(--text-3xl);
		line-height: var(--leading-tight);
	}
	.heading-l {
		font-size: var(--text-4xl);
		line-height: var(--leading-tight);
	}

	.banner {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--gap-md);
		padding: var(--gap-md) var(--gap-lg);
		background: var(--hue-neutral-200);
		text-align: center;
	}

	.site-header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--gap-md) var(--gap-xl);
		padding-block: var(--gap-sm);
	}
	.brand {
		flex: 1 1 auto;
		display: inline-flex;
		align-items: center;
		gap: var(--gap-sm);
		font-size: var(--text-xl);
		font-weight: var(--fw-medium);
	}
	.primary-nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-md) var(--gap-2xl);
		color: var(--ext-body);
	}
	.primary-nav a {
		display: inline-flex;
		align-items: center;
		gap: var(--gap-xs);
	}
	.actions {
		flex: 1 1 auto;
		display: flex;
		justify-content: end;
		align-items: center;
		gap: var(--gap-sm);
	}
	.quiet-link {
		padding-inline: var(--gap-lg);
		color: var(--ext-quiet);
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: var(--gap-sm);
		padding: var(--gap-sm) var(--gap-lg);
		background: var(--ext-ink);
		color: var(--ext-surface);
		white-space: nowrap;
	}
	.pill[data-variant='soft'] {
		background: var(--hue-stone-100);
		color: var(--ext-ink);
	}
	.pill[data-variant='faint'] {
		background: var(--hue-stone-100);
		color: var(--ext-quiet);
	}
	.pill[data-variant='light'] {
		background: var(--hue-white);
		color: var(--hue-stone-950);
	}
	.pill[data-size='large'] {
		padding: var(--gap-md) var(--gap-lg);
		font-size: var(--text-md);
	}

	.hero {
		display: grid;
		justify-items: center;
		padding-block-start: var(--gap-3xl);
		text-align: center;
	}
	.announce {
		display: inline-flex;
		align-items: center;
		gap: var(--gap-sm);
		padding: var(--gap-xs) var(--gap-sm) var(--gap-xs) var(--gap-xs);
		border: var(--border-w-thin) solid var(--hue-stone-200);
		border-radius: var(--radius-full);
		background: var(--ext-surface-soft);
		color: var(--ext-body);
	}
	.announce b {
		padding: var(--gap-xs) var(--gap-sm);
		border-radius: var(--radius-full);
		background: var(--ext-accent);
		color: var(--hue-white);
		font-size: var(--text-xs);
		font-weight: var(--fw-regular);
	}
	.hero h1 {
		max-inline-size: 16em;
		margin-block-start: var(--gap-xl);
		font-size: var(--text-5xl);
		line-height: var(--leading-tight);
	}
	.hero em {
		color: var(--ext-accent);
		font-style: normal;
	}
	.lede {
		margin-block-start: var(--gap-xl);
		max-inline-size: 38em;
		color: var(--ext-body);
		font-size: var(--text-lg);
		line-height: var(--leading-loose);
	}
	.cta-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--gap-sm);
		margin-block-start: var(--gap-xl);
	}

	.logo-strip {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--gap-xl) var(--gap-4xl);
		padding-block: var(--gap-5xl) var(--gap-4xl);
		color: var(--hue-stone-500);
		font-size: var(--text-2xl);
		font-weight: var(--fw-medium);
	}

	.demo {
		position: relative;
	}
	.art {
		position: absolute;
		inset: 0;
	}
	.arc {
		position: absolute;
		inset-block-start: calc(var(--gap-lg) * -1);
		inset-inline-start: 52%;
		inline-size: 30%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--ext-accent);
		filter: blur(2px);
	}
	.band {
		position: absolute;
		inline-size: 50vw;
		block-size: 40%;
		background:
			repeating-linear-gradient(
				176deg,
				transparent 0 2.75rem,
				color-mix(in oklch, var(--hue-white) 22%, transparent) 2.75rem 2.85rem
			),
			linear-gradient(175deg, var(--hue-orange-400), var(--ext-accent) 60%, var(--hue-orange-400));
	}
	.band[data-side='left'] {
		inset-block-start: 18%;
		inset-inline-end: 96%;
		border-start-end-radius: 40%;
	}
	.band[data-side='right'] {
		inset-block-start: 28%;
		inset-inline-start: 96%;
		border-end-start-radius: 40%;
	}
	.demo-tabs {
		position: relative;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--gap-xs);
		inline-size: fit-content;
		margin: 0 auto calc(var(--gap-xl) * -1);
		padding: var(--gap-xs);
		border-radius: var(--gap-xl);
		background: var(--ext-surface-soft);
		box-shadow: var(--shadow-z1);
	}
	.demo-tab {
		padding: var(--gap-sm) var(--gap-md);
		border: 0;
		border-radius: var(--radius-full);
		background: var(--hue-white);
		color: var(--ext-body);
		font: inherit;
		line-height: var(--leading-ui);
		cursor: pointer;
	}
	.demo-tab[data-state='active'] {
		background: var(--ext-accent);
		color: var(--hue-white);
	}
	.window {
		position: relative;
		z-index: 1;
		padding: 0 var(--gap-sm) var(--gap-sm);
		border-radius: var(--radius-xl);
		background: color-mix(in oklch, var(--hue-stone-200) 75%, transparent);
		backdrop-filter: blur(var(--gap-xl));
		box-shadow: var(--shadow-z2);
	}
	.traffic {
		display: flex;
		gap: var(--gap-sm);
		padding: var(--gap-lg);
	}
	.traffic i {
		inline-size: var(--gap-md);
		block-size: var(--gap-md);
		border-radius: var(--radius-full);
		background: var(--hue-stone-300);
	}
	/* A cropped screenshot: the cap is the design, and whatever wraps past it is cut off. */
	.window-body {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		max-block-size: 37.5rem;
		border-radius: var(--radius-lg);
		background: var(--ext-surface);
		overflow: hidden;
		font-size: var(--text-xs);
	}
	.window-body[hidden] {
		display: none;
	}
	.mock-site {
		flex: 3 1 28rem;
		min-inline-size: 0;
	}
	.mock-top {
		display: flex;
		align-items: center;
		gap: var(--gap-lg);
		padding: var(--gap-md) var(--gap-lg);
		color: var(--ext-body);
	}
	.mock-top strong {
		color: var(--ext-ink);
		font-size: var(--text-sm);
		font-weight: var(--fw-medium);
	}
	.mock-search {
		flex: 0 1 12rem;
		margin-inline: auto;
		padding: var(--gap-xs) var(--gap-sm);
		border: var(--border-w-thin) solid var(--hue-stone-200);
		border-radius: var(--radius-sm);
	}
	.mock-button {
		padding: var(--gap-xs) var(--gap-md);
		border: var(--border-w-thin) solid var(--hue-stone-200);
		border-radius: var(--radius-sm);
	}
	.mock-nav {
		display: flex;
		gap: var(--gap-xl);
		padding-inline: var(--gap-lg);
		border-block-end: var(--border-w-thin) solid var(--hue-stone-200);
		color: var(--ext-body);
	}
	.mock-nav span {
		padding-block: var(--gap-sm);
	}
	.mock-nav [data-active] {
		color: var(--ext-accent);
		border-block-end: var(--border-w-thin) solid var(--ext-accent);
	}
	/* wrap-reverse: on a narrow screen the page content stacks above the sidebar. */
	.mock-columns {
		display: flex;
		flex-wrap: wrap-reverse;
		align-items: flex-end;
	}
	.mock-side {
		display: flex;
		flex-direction: column;
		gap: var(--gap-md);
		padding: var(--gap-md) var(--gap-lg);
		color: var(--ext-body);
	}
	.mock-side strong {
		color: var(--ext-ink);
		font-family: var(--ff-mono);
		font-size: 0.625rem;
	}
	.mock-side span {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
	}
	.mock-main {
		flex: 1 1 20rem;
		min-inline-size: 0;
		padding: var(--gap-md) var(--gap-lg);
	}
	.mock-main small {
		color: var(--ext-body);
		font-family: var(--ff-mono);
		font-size: 0.625rem;
	}
	.mock-main h2 {
		margin-block: var(--gap-md) var(--gap-sm);
		font-size: var(--text-xl);
	}
	.mock-main p {
		color: var(--ext-body);
		font-size: var(--text-sm);
		line-height: var(--leading-tight);
	}
	.mock-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
		gap: var(--gap-lg);
		margin-block-start: var(--gap-lg);
	}
	.mock-card {
		display: grid;
		gap: var(--gap-xs);
		padding-block-end: var(--gap-md);
		border: var(--border-w-thin) solid var(--hue-stone-100);
		border-radius: var(--radius-md);
	}
	.mock-card > :not(.mock-card-art) {
		padding-inline: var(--gap-md);
	}
	.mock-card > strong {
		font-size: var(--text-sm);
	}
	.mock-card > span {
		color: var(--ext-body);
	}
	.mock-card-art {
		display: grid;
		place-items: center;
		padding-block: var(--gap-4xl);
		margin-block-end: var(--gap-sm);
		border-radius: var(--radius-md) var(--radius-md) 0 0;
		background: var(--hue-stone-100);
	}
	.mock-float {
		position: absolute;
		inset-block-end: var(--gap-5xl);
		inset-inline-start: 33%;
	}
	.mock-chat {
		flex: 1 1 16rem;
		box-sizing: border-box;
		max-block-size: 37.5rem;
		display: flex;
		flex-direction: column;
		gap: var(--gap-sm);
		padding: var(--gap-md) var(--gap-lg) var(--gap-lg);
		border-inline-start: var(--border-w-thin) solid var(--hue-stone-200);
		color: var(--ext-body);
	}
	.mock-chat strong {
		color: var(--ext-ink);
		font-size: var(--text-sm);
		font-weight: var(--fw-medium);
	}
	.chat-hello {
		display: grid;
		justify-items: center;
		gap: var(--gap-sm);
		margin-block: auto;
		padding-block: var(--gap-sm);
	}
	.chat-mark {
		display: grid;
		place-items: center;
		padding: var(--gap-lg);
		border-radius: 50%;
		background: var(--hue-orange-100);
		color: var(--ext-ink);
	}
	.chat-suggestion {
		padding: var(--gap-md);
		border-radius: var(--radius-md);
		background: var(--hue-orange-50);
		color: var(--ext-ink);
		font-size: var(--text-sm);
	}
	.chat-field {
		display: grid;
		gap: var(--gap-lg);
		margin-block-start: var(--gap-sm);
		padding: var(--gap-md);
		border: var(--border-w-thin) solid var(--hue-orange-400);
		border-radius: var(--radius-xl);
		font-size: var(--text-sm);
	}
	.chat-field small {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--ext-quiet);
		font-size: var(--text-xs);
	}
	.chat-field b {
		padding: var(--gap-xs) var(--gap-md);
		border-radius: var(--radius-full);
		background: var(--hue-orange-200);
		color: var(--ext-accent);
		font-weight: var(--fw-regular);
	}

	.get-started {
		display: grid;
		justify-items: center;
		padding-block-start: var(--gap-5xl);
		text-align: center;
	}
	.assistant-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--gap-md);
		max-inline-size: 47rem;
		inline-size: 100%;
		box-sizing: border-box;
		margin-block-start: var(--gap-lg);
		padding: var(--gap-lg);
		border: var(--border-w-thin) solid var(--hue-orange-500);
		border-radius: var(--gap-3xl);
		background: color-mix(in oklch, var(--ext-accent) 5%, transparent);
	}
	.assistant-row li {
		flex: 1 1 10rem;
	}
	.assistant-row a {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--gap-sm);
		padding: var(--gap-md);
		border-radius: var(--radius-full);
		background: var(--ext-surface);
	}
	.setup-line {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: var(--gap-sm);
		margin-block-start: var(--gap-lg);
	}
	.copy {
		padding: var(--gap-sm) var(--gap-md);
		border: 0;
		border-radius: var(--radius-full);
		background: var(--ext-surface-soft);
		color: var(--ext-body);
		font: inherit;
		font-size: var(--text-xs);
		line-height: var(--leading-ui);
		cursor: pointer;
	}

	.split {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
		gap: var(--gap-3xl) var(--gap-4xl);
		align-items: center;
		padding-block-start: var(--gap-5xl);
	}
	.split-text h2 {
		margin-block-start: var(--gap-lg);
	}
	.split-text h2:first-child {
		margin-block-start: 0;
	}
	.split-text p {
		margin-block-start: var(--gap-lg);
		color: var(--ext-body);
		font-size: var(--text-lg);
		line-height: var(--leading-loose);
		text-wrap: pretty;
	}
	.tracker {
		display: inline-flex;
		align-items: center;
		gap: var(--gap-sm);
		padding: var(--gap-xs) var(--gap-md) var(--gap-xs) var(--gap-xs);
		border: var(--border-w-thin) solid var(--ext-line);
		border-radius: var(--radius-full);
		background: var(--ext-surface-soft);
		font-size: var(--text-xs);
	}
	.tracker b {
		padding: var(--gap-xs) var(--gap-sm);
		border-radius: var(--radius-full);
		background: var(--ext-accent);
		color: var(--hue-white);
		font-weight: var(--fw-regular);
	}
	.tracker span {
		color: var(--ext-accent);
		font-family: var(--ff-mono);
		font-size: var(--text-sm);
		font-weight: var(--fw-semibold);
	}
	.visual {
		position: relative;
		aspect-ratio: 567 / 341;
		border-radius: var(--radius-xl);
		background: var(--hue-neutral-50);
		overflow: hidden;
	}
	.visual-flare {
		position: absolute;
		inset-block: -15%;
		inset-inline-end: -21%;
		inline-size: 31%;
		border-radius: 50%;
		background: linear-gradient(180deg, var(--hue-orange-500), var(--ext-accent));
	}
	.check-window {
		position: absolute;
		inset-block-start: 18%;
		inset-inline-start: 22.5%;
		inline-size: 113%;
		block-size: 92%;
		padding: var(--gap-md);
		border: var(--border-w-thin) dashed var(--hue-orange-400);
		border-radius: var(--gap-lg) var(--gap-xl) var(--gap-xl) 0;
	}
	.traffic-colour {
		display: flex;
		gap: var(--gap-xs);
		margin-block-end: var(--gap-lg);
	}
	.traffic-colour i {
		inline-size: var(--gap-sm);
		block-size: var(--gap-sm);
		border-radius: 50%;
		background: var(--ext-accent);
	}
	.traffic-colour i:nth-child(2) {
		background: var(--hue-amber-500);
	}
	.traffic-colour i:nth-child(3) {
		background: var(--hue-emerald-500);
	}
	.bar {
		position: relative;
		display: block;
		block-size: var(--gap-md);
		margin-block-end: var(--gap-sm);
		border-radius: var(--radius-sm);
		background: var(--ext-ok);
	}
	.bar[data-state='error'] {
		background: var(--ext-accent);
	}
	.bar[data-state='error']::after {
		content: '⚠';
		position: absolute;
		inset-inline-start: calc(100% + var(--gap-sm));
		inset-block-start: calc(var(--gap-xs) * -1);
		color: var(--ext-accent);
		font-size: var(--text-sm);
	}
	.check-card {
		position: absolute;
		inset-block-end: 12%;
		inset-inline-start: 8%;
		display: flex;
		align-items: center;
		gap: var(--gap-md);
		padding: var(--gap-lg);
		border-radius: var(--gap-md);
		background: var(--ext-surface);
		box-shadow: var(--shadow-z2);
		font-size: var(--text-md);
	}
	.check-card .icon {
		font-size: var(--text-2xl);
	}
	.check-card i {
		display: block;
		inline-size: var(--gap-xl);
		block-size: var(--border-w-standard);
		margin-block-start: var(--gap-xs);
		background: var(--ext-accent);
	}
	.hub {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
	}

	.tile {
		display: grid;
		place-items: center;
		inline-size: fit-content;
		padding: var(--gap-md);
		border-radius: var(--radius-lg);
		background: var(--ext-surface-soft);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--hue-black) 25%, transparent);
		font-size: var(--text-xl);
	}

	.system {
		display: grid;
		justify-items: center;
		padding-block-start: var(--gap-5xl);
		text-align: center;
	}
	.system h2 {
		max-inline-size: 22em;
	}
	/* The side tiles hang off the capsule by half their width, so it leaves that room. */
	.diagram {
		position: relative;
		display: grid;
		place-items: center;
		inline-size: calc(100% - var(--gap-3xl));
		max-inline-size: 53rem;
		box-sizing: border-box;
		margin-block-start: var(--gap-4xl);
		padding-block: var(--gap-3xl);
		border: var(--border-w-thin) dashed var(--hue-orange-400);
		border-radius: var(--radius-full);
		background: color-mix(in oklch, var(--ext-accent) 7%, transparent);
	}
	.diagram > .tile {
		position: absolute;
		background: var(--ext-surface);
	}
	.diagram > .tile[data-at='top'] {
		inset-block-start: 0;
		translate: 0 -50%;
	}
	.diagram > .tile[data-at='bottom'] {
		inset-block-end: 0;
		translate: 0 50%;
	}
	.diagram > .tile[data-at='left'] {
		inset-inline-start: 0;
		translate: -50% 0;
	}
	.diagram > .tile[data-at='right'] {
		inset-inline-end: 0;
		translate: 50% 0;
	}
	.dash {
		position: absolute;
		block-size: var(--border-w-standard);
		background: var(--ext-accent);
	}
	.dash[data-at='top'] {
		inset-block-start: 0;
		inset-inline-start: 50%;
		inline-size: 28%;
	}
	.dash[data-at='left'] {
		inset-inline-start: 22%;
		inline-size: 6%;
	}
	.dash[data-at='right'] {
		inset-inline-end: 22%;
		inline-size: 6%;
	}
	.cube {
		inline-size: var(--gap-5xl);
		block-size: auto;
		scale: 1.3;
	}

	.pillars {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
		gap: var(--gap-xl);
		inline-size: 100%;
		margin-block-start: var(--gap-4xl);
		text-align: start;
	}
	.pillar {
		display: flex;
		flex-direction: column;
		padding: var(--gap-xl);
		border: var(--border-w-thin) solid var(--ext-line);
		border-radius: var(--radius-xl);
	}
	.pillar h3 {
		margin-block-start: var(--gap-lg);
		font-size: var(--text-xl);
		line-height: var(--leading-tight);
		text-wrap: pretty;
	}
	.pillar p {
		flex: 1;
		margin-block: var(--gap-md) var(--gap-3xl);
		color: var(--ext-body);
		font-size: var(--text-md);
		line-height: var(--leading-loose);
		text-wrap: pretty;
	}
	.tag {
		align-self: start;
		padding: var(--gap-md);
		border-radius: var(--radius-full);
		background: color-mix(in oklch, var(--hue-black) 4%, transparent);
		font-size: var(--text-md);
	}

	.quote {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center;
		gap: var(--gap-xl) var(--gap-3xl);
		--measure: 48rem;
		padding-block-start: var(--gap-5xl);
	}
	.portrait {
		display: grid;
		justify-items: center;
		gap: var(--gap-sm);
		padding: var(--gap-md) var(--gap-xl);
		border: var(--border-w-thin) solid var(--ext-line);
		border-radius: var(--radius-lg);
		background: var(--ext-surface-soft);
		font-size: var(--text-lg);
	}
	.portrait i {
		padding: var(--gap-2xl) var(--gap-3xl);
		border-radius: 50%;
		background: var(--hue-stone-200);
		padding-inline: var(--gap-2xl);
	}
	.portrait b {
		font-weight: var(--fw-medium);
	}
	.quote blockquote {
		flex: 1 1 24rem;
		min-inline-size: 0;
		margin: 0;
	}
	.quote p {
		font-family: var(--ff-sans);
		font-size: var(--text-2xl);
		line-height: var(--leading-tight);
		text-wrap: pretty;
	}
	.quote footer {
		margin-block: var(--gap-md) var(--gap-xl);
		color: var(--ext-quiet);
		font-size: var(--text-md);
		line-height: var(--leading-tight);
	}
	.quote footer span {
		color: var(--ext-ink);
	}

	.enterprise-section {
		display: grid;
		justify-items: center;
		padding-block-start: var(--gap-5xl);
		text-align: center;
	}
	.enterprise-section > .pill {
		margin-block-start: var(--gap-lg);
	}
	.enterprise-section > .lede {
		margin-block-start: var(--gap-lg);
	}
	.enterprise {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-2xl);
		inline-size: 100%;
		margin-block-start: var(--gap-3xl);
		text-align: start;
	}
	.enterprise-column {
		flex: 1 1 13rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--gap-3xl);
	}
	.enterprise h3 {
		margin-block-start: var(--gap-lg);
		font-size: var(--text-xl);
		line-height: var(--leading-tight);
	}
	.enterprise p {
		margin-block-start: var(--gap-sm);
		color: var(--ext-body);
		font-family: var(--ff-sans);
		font-size: var(--text-md);
		line-height: var(--leading-loose);
		text-wrap: pretty;
	}
	.enterprise-art {
		order: 1;
		flex: 3 1 24rem;
		display: grid;
		place-items: center;
		padding-block: var(--gap-5xl);
		border-radius: var(--radius-xl);
		background: linear-gradient(135deg, var(--hue-orange-200), var(--ext-accent) 70%);
	}
	.enterprise-art i {
		inline-size: 55%;
		aspect-ratio: 1.3;
		border-radius: var(--radius-xl);
		background: color-mix(in oklch, var(--ext-surface) 80%, transparent);
		box-shadow: var(--shadow-z2);
	}
	.metrics-title {
		justify-self: start;
		margin-block-start: var(--gap-3xl);
		font-size: var(--text-2xl);
	}
	.metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
		gap: var(--gap-xl) 0;
		inline-size: 100%;
		margin: var(--gap-xl) 0 0;
		text-align: start;
	}
	.metrics > div {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--gap-xs) var(--gap-sm);
		align-items: center;
		padding-inline: var(--gap-md);
		border-inline-start: var(--border-w-thin) solid var(--ext-line);
	}
	.metrics dt {
		grid-column: 1 / -1;
		margin-block-end: var(--gap-xl);
		font-size: var(--text-2xl);
		font-weight: var(--fw-medium);
	}
	.metrics dd {
		margin: 0;
	}
	.metric-tile {
		padding: var(--gap-xs);
		border-radius: var(--radius-xs);
		background: var(--ext-accent);
		color: var(--hue-white);
		font-size: var(--text-xs);
	}
	.metric-value {
		color: var(--ext-accent);
		font-size: var(--text-lg);
	}
	.metric-label {
		grid-column: 2;
		line-height: var(--leading-tight);
	}

	.customers {
		padding-block-start: var(--gap-5xl);
	}
	.eyebrow {
		color: var(--ext-accent);
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		font-weight: var(--fw-semibold);
	}
	.customers-head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: end;
		gap: var(--gap-lg) var(--gap-2xl);
		margin-block-start: var(--gap-md);
	}
	.customers-head h2 {
		max-inline-size: 16em;
	}
	/* Runs off the viewport's right edge, so the row reads as continuing. */
	.customer-row {
		display: flex;
		gap: var(--gap-xl);
		margin-block-start: var(--gap-2xl);
		margin-inline-end: calc((100% - 100vw) / 2);
		overflow-x: auto;
		scrollbar-width: none;
	}
	.customer-row li {
		position: relative;
		flex: none;
		display: grid;
		place-items: center;
		inline-size: min(20rem, 80vw);
		aspect-ratio: 1;
		border: var(--border-w-thin) solid var(--ext-line);
		border-radius: var(--radius-lg);
		background: var(--ext-surface-soft);
	}
	.customer-row b {
		font-size: var(--text-3xl);
		font-weight: var(--fw-medium);
	}
	.round {
		position: absolute;
		inset-block-end: var(--gap-lg);
		padding: var(--gap-md);
		border-radius: 50%;
		background: var(--hue-stone-100);
	}
	.carousel-nav {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: var(--gap-lg);
		margin-block-start: var(--gap-xl);
	}
	.carousel-nav button {
		padding: var(--gap-md);
		border: 0;
		border-radius: 50%;
		background: var(--hue-neutral-100);
		font: inherit;
		line-height: var(--leading-ui);
		cursor: pointer;
	}
	.pager {
		display: flex;
		gap: var(--gap-xs);
		margin-inline-end: auto;
	}
	.pager i {
		padding: 0 var(--gap-xs);
		block-size: var(--border-w-thick);
		border-radius: var(--radius-full);
		background: var(--hue-stone-400);
	}
	.pager i:first-child {
		padding-inline: var(--gap-md);
		background: var(--ext-ink);
	}

	.closing {
		position: relative;
		display: grid;
		justify-items: center;
		margin-block-start: var(--gap-5xl);
		padding: calc(var(--gap-5xl) * 2) var(--gap-lg);
		background: var(--ext-surface-soft);
		text-align: center;
	}
	.closing > :not(.watermark) {
		position: relative;
	}
	.watermark {
		position: absolute;
		inset: 50% auto auto 50%;
		translate: -50% -50%;
		inline-size: min(34rem, 100%);
		color: var(--hue-neutral-100);
	}
	.closing h2 {
		font-size: var(--text-5xl);
		line-height: var(--leading-tight);
	}
	.closing p {
		margin-block-start: var(--gap-xl);
		max-inline-size: 28em;
		color: var(--ext-quiet);
		font-size: var(--text-md);
		line-height: var(--leading-loose);
	}

	.site-footer {
		margin-block-start: var(--gap-5xl);
		padding-block: var(--gap-4xl) var(--gap-2xl);
		background: var(--ext-surface-soft);
	}
	.footer-top {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--gap-lg);
	}
	.socials,
	.summary-icons {
		display: flex;
		gap: var(--gap-lg);
	}
	.socials i,
	.summary-icons i {
		padding: var(--gap-sm);
		border-radius: 50%;
		background: var(--ext-quiet);
	}
	.footer-main {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-3xl) var(--gap-xl);
		margin-block-start: var(--gap-3xl);
	}
	.footer-links {
		flex: 999 1 32rem;
		min-inline-size: 0;
		display: grid;
		gap: var(--gap-2xl);
	}
	.footer-group h2 {
		font-size: var(--text-xl);
	}
	.footer-lead {
		display: block;
		margin-block-start: var(--gap-lg);
		color: var(--ext-quiet);
	}
	/* Each column draws a rule on its left. Clipping one pixel hides the rule on the first column of any row. */
	.footer-columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
		gap: var(--gap-xl) 0;
		margin-block-start: var(--gap-xl);
		margin-inline-start: calc((var(--gap-2xl) + var(--border-w-thin)) * -1);
		clip-path: inset(0 0 0 var(--border-w-thin));
	}
	.footer-columns > div {
		padding-inline-start: var(--gap-2xl);
		border-inline-start: var(--border-w-thin) solid var(--hue-stone-200);
	}
	.footer-columns h3 {
		color: var(--ext-accent);
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		font-weight: var(--fw-semibold);
		text-transform: uppercase;
	}
	.footer-columns ul {
		display: grid;
		gap: var(--gap-xl);
		margin-block-start: var(--gap-lg);
		color: var(--ext-quiet);
	}
	.promos {
		flex: 1 1 17.5rem;
		display: grid;
		align-content: start;
		gap: var(--gap-lg);
	}
	.promo {
		display: grid;
		justify-items: start;
		gap: var(--gap-sm);
		padding: var(--gap-lg);
		border-radius: var(--radius-lg);
		background: color-mix(in oklch, var(--ext-accent) 7%, transparent);
		line-height: var(--leading-tight);
	}
	.promo strong {
		font-size: var(--text-md);
		font-weight: var(--fw-medium);
	}
	.promo > a:not(.pill) {
		text-decoration: underline;
		text-decoration-color: var(--ext-accent);
		text-underline-offset: 0.25em;
	}
	.promo[data-tone='accent'] {
		background: var(--ext-accent);
		color: var(--hue-white);
	}
	.promo-mark {
		font-size: var(--text-2xl);
	}
	.promo-logo {
		padding: var(--gap-lg) var(--gap-3xl);
		border-radius: var(--radius-sm);
		background: var(--hue-blue-800);
		color: var(--hue-white);
		font-style: normal;
		font-size: var(--text-xl);
	}
	.promo-icon {
		padding: var(--gap-xl);
		border-radius: var(--radius-lg);
		background: linear-gradient(135deg, var(--hue-light-blue-400), var(--ext-accent));
	}
	.badges {
		display: flex;
		gap: var(--gap-xl);
		margin-block-start: var(--gap-2xl);
	}
	.badges i {
		padding: var(--gap-xl);
		border-radius: 50%;
		border: var(--border-w-standard) solid var(--hue-stone-500);
	}
	.fine {
		margin-block-start: var(--gap-xl);
		color: var(--ext-quiet);
		font-size: var(--text-xs);
		line-height: var(--leading-loose);
	}
	.summary-title {
		margin-block-start: var(--gap-xl);
		font-size: var(--text-md);
	}
	.summary-icons {
		margin-block-start: var(--gap-md);
	}
	.legal {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-md) var(--gap-2xl);
		margin-block-start: var(--gap-3xl);
		color: var(--ext-quiet);
		font-size: var(--text-xs);
	}
</style>
