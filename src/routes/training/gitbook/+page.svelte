<!-- Training prototype: design-training round "gitbook", homepage layout study. Copy and brand are invented. Rem offsets are measured from the reference at 1440px, because fluid space tokens can't hold them. Deleted when training graduates. -->
<script lang="ts">
	import { Tabs } from 'bits-ui';
	import './suede-extensions.css';

	const nav = ['Product', 'Solutions', 'Resources'];
	const logos = ['Northwind', 'Halyard', 'Quarry', 'Tessel', 'Orbit', 'Juniper'];
	const demoTabs = ['Ask anything', 'Reader insights', 'Embed and link', 'Auto updates'];
	const sideLinks = [
		'Welcome',
		'First steps',
		'Core ideas',
		'Performance',
		'Workloads',
		'Tuning',
		'Overview',
		'Best practices',
		'Hardening',
		'Patching',
		'Audit logs',
		'Incidents'
	];
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
	const glyphs = {
		branch: 'M5 3v10M11 3v3a3 3 0 0 1-3 3H5',
		scan: 'M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4M5 8h6',
		spark: 'M8 2l1.5 4.5L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5z',
		bulb: 'M8 2a4 4 0 0 0-2 7.5V11h4V9.5A4 4 0 0 0 8 2zM6.5 14h3',
		move: 'M2 8h10M9 5l3 3-3 3M14 3v10',
		lock: 'M4 7h8v7H4zM6 7V5a2 2 0 0 1 4 0v2'
	};
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
	const enterprise = [
		[
			'Guided migration',
			'A specialist moves your content across, trains your team and gets everyone publishing quickly.',
			'move'
		],
		[
			'Compliance built in',
			'Audit trails, single sign-on and data residency for teams in regulated industries.',
			'lock'
		],
		[
			'Granular access',
			'Decide exactly who can read, comment on and change each space, with roles that fit.',
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
	<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
		<path d="M3 8h10M9 4l4 4-4 4" />
	</svg>
{/snippet}

{#snippet chevron()}
	<svg class="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
		<path d="M4 6l4 4 4-4" />
	</svg>
{/snippet}

{#snippet mark()}
	<svg class="icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
		<path d="M8 1l7 4-7 4-7-4zM1 8l7 4 7-4v3l-7 4-7-4z" />
	</svg>
{/snippet}

{#snippet glyph(path: string)}
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"
		><path d={path} /></svg
	>
{/snippet}

<div class="page">
	<a class="banner ext:fs-14" href="#top"
		>Scheduled maintenance this Saturday. See the status page {@render arrow()}</a
	>

	<header class="site-header" id="top">
		<a class="brand ext:fs-20" href="#top">{@render mark()} Foldline</a>
		<nav class="primary-nav ext:fs-14" aria-label="Primary">
			{#each nav as item (item)}<a href="#top">{item} {@render chevron()}</a>{/each}
			<a href="#top">Pricing</a>
		</nav>
		<div class="actions ext:fs-14">
			<a class="quiet-link" href="#top">Log in</a>
			<a class="pill" data-variant="faint" href="#top">Try it free</a>
			<a class="pill" href="#top">Contact us</a>
		</div>
	</header>

	<main>
		<section class="hero">
			<a class="announce ext:fs-14" href="#top"
				><b class="ext:fs-12">New</b> Drift checks for every space {@render arrow()}</a
			>
			<h1>Docs that notice when they're wrong. <em>Then repair themselves.</em></h1>
			<p class="lede ext:fs-18">Foldline keeps documentation current for readers and for agents</p>
			<div class="cta-row">
				<a class="pill ext:fs-16" data-size="large" href="#top">Try it free {@render arrow()}</a>
				<a class="pill ext:fs-16" data-size="large" data-variant="soft" href="#top"
					>Continue with your repo</a
				>
			</div>
		</section>

		<ul class="logo-strip" aria-label="Example customers">
			{#each logos as logo (logo)}<li class="ext:fs-24">{logo}</li>{/each}
		</ul>

		<section class="demo">
			<div class="art" aria-hidden="true">
				<i class="arc"></i><i class="band" data-side="left"></i><i class="band" data-side="right"
				></i>
			</div>
			<Tabs.Root value={demoTabs[0]}>
				<Tabs.List>
					{#snippet child({ props })}
						<div {...props} class="demo-tabs ext:fs-14">
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
										<div class="mock-top ext:fs-12">
											<strong class="ext:fs-14">Sample Co</strong>
											<span class="mock-search">Search…</span>
											<span class="mock-button">Sign in</span>
										</div>
										<div class="mock-nav ext:fs-12">
											<span data-active>Product</span><span>API</span><span>Help center</span><span
												>Changelog</span
											>
										</div>
										<div class="mock-columns">
											<aside class="mock-side ext:fs-12">
												<strong class="mono">GETTING STARTED</strong>
												{#each sideLinks.slice(0, 6) as link (link)}<span
														>{@render glyph(glyphs.bulb)} {link}</span
													>{/each}
												<strong class="mono">SECURITY</strong>
												{#each sideLinks.slice(6) as link (link)}<span
														>{@render glyph(glyphs.lock)} {link}</span
													>{/each}
											</aside>
											<div class="mock-main">
												<small class="mono">GETTING STARTED</small>
												<h2 class="ext:fs-20">{tab}</h2>
												<p class="ext:fs-14">
													A sample space showing how a published site looks to its readers.
												</p>
												<div class="mock-cards">
													{#each mockCards as card (card)}
														<div class="mock-card">
															<div class="mock-card-art">
																<span class="tile">{@render mark()}</span>
															</div>
															<strong class="ext:fs-14">{card}</strong>
															<span class="ext:fs-12">A short sample description.</span>
														</div>
													{/each}
												</div>
												<a
													class="pill mock-float ext:fs-16"
													data-size="large"
													href="#top"
													tabindex="-1">Foldline Assistant {@render arrow()}</a
												>
											</div>
										</div>
									</div>
									<aside class="mock-chat ext:fs-12">
										<strong class="ext:fs-14">Assistant</strong>
										<div class="chat-hello">
											<span class="chat-mark">{@render mark()}</span>
											<strong class="ext:fs-14">Good morning</strong>
											<span>What can I help you find?</span>
										</div>
										<span class="chat-suggestion ext:fs-14">What can the assistant do?</span>
										<span class="chat-suggestion ext:fs-14">How do I add a teammate?</span>
										<span class="chat-suggestion ext:fs-14">Where is the API key?</span>
										<span class="chat-field ext:fs-14"
											>How do I get started?<small class="ext:fs-12"
												>Based on your context <b>Send</b></small
											></span
										>
									</aside>
								</div>
							{/snippet}
						</Tabs.Content>
					{/each}
				</div>
			</Tabs.Root>
		</section>

		<section class="get-started">
			<h2 class="heading-32">Start with your assistant</h2>
			<ul class="assistant-row ext:fs-14">
				{#each assistants as assistant (assistant)}<li>
						<a href="#top">{@render mark()} {assistant}</a>
					</li>{/each}
			</ul>
			<p class="setup-line ext:fs-14">
				Set up Foldline from your agent <button class="copy ext:fs-12">Copy prompt</button>
			</p>
		</section>

		<section class="split">
			<div>
				<span class="tracker ext:fs-12"
					><b>Stale page tracker</b><span class="mono">{traffic.toFixed(3)}%</span></span
				>
				<h2 class="heading-32">One stale page becomes a thousand wrong answers</h2>
				<p class="ext:fs-18">
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

		<section class="split" data-order="reversed">
			<div>
				<h2 class="heading-32">Readable by agents isn't the same as right for readers</h2>
				<p class="ext:fs-18">
					Formatting pages for machines is the easy part. Foldline also checks that what they find
					can be trusted, so anyone following the steps, person or agent, ends up with the correct
					result.
				</p>
			</div>
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
							stroke="var(--hue-stone-100)"
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
		</section>

		<section class="system">
			<h2 class="heading-38">A system built around keeping docs right, not only writing them</h2>
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

		<section class="quote">
			<div class="portrait" aria-hidden="true"><i></i><b>Northwind</b></div>
			<blockquote>
				<p>
					“Sample testimonial: our docs used to be a chore nobody wanted. Now keeping them right
					takes almost no effort, and we finally trust what our readers are told when they ask a
					question. It did exactly what we needed, for them and for us, and writing our reference
					pages got far easier.”
				</p>
				<footer>Placeholder Name, Head of Product, <span>Northwind</span></footer>
				<a class="pill ext:fs-16" data-size="large" href="#top">Read the docs</a>
			</blockquote>
		</section>

		<section class="enterprise-section">
			<h2 class="heading-38">Enterprise docs that stay correct at scale</h2>
			<p class="ext:fs-18">
				Single sign-on, audit trails, access controls and migration help.<br />Made for larger teams
				with stricter requirements.
			</p>
			<a class="pill ext:fs-16" data-size="large" href="#top">Book a demo</a>
			<div class="enterprise">
				{#each enterprise as [title, body, icon] (title)}
					<article>
						<span class="tile">{@render glyph(glyphs[icon])}</span>
						<h3>{title}</h3>
						<p>{body}</p>
					</article>
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

		<section class="quote">
			<div class="portrait" aria-hidden="true"><i></i><b>Halyard</b></div>
			<blockquote>
				<p>
					“Sample testimonial: connecting our agents to the docs shortened every partner rollout by
					weeks, and it gave our integrators a far quicker path to launch.”
				</p>
				<footer>Placeholder Name, VP of Engineering, <span>Halyard</span></footer>
				<a class="pill ext:fs-16" data-size="large" href="#top">Read the story</a>
			</blockquote>
		</section>

		<section class="customers">
			<span class="eyebrow">CUSTOMERS</span>
			<div class="customers-head">
				<h2 class="heading-38">Teams like yours are writing better docs with Foldline</h2>
				<a class="pill ext:fs-16" data-size="large" href="#top">View all</a>
			</div>
			<ul class="customer-row" bind:this={carousel}>
				{#each logos as logo (logo)}
					<li><b>{logo}</b><span class="round">↗</span></li>
				{/each}
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
				Your docs already feed AI tools. Are readers<br />getting the right answers, or the wrong
				ones?
			</p>
			<div class="cta-row">
				<a class="pill ext:fs-16" data-size="large" href="#top">Try it free {@render arrow()}</a>
				<a class="pill ext:fs-16" data-size="large" data-variant="soft" href="#top">Talk to sales</a
				>
			</div>
		</section>
	</main>

	<footer class="site-footer">
		<div class="footer-inner">
			<div class="footer-top">
				<a class="brand ext:fs-20" href="#top">{@render mark()} Foldline</a>
				<div class="socials" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
			</div>
			<div class="footer-main">
				<div>
					{#each footer as group (group.heading)}
						<nav aria-label={group.heading} class="footer-group">
							<h2>{group.heading}</h2>
							{#if group.lead}<a class="footer-lead" href="#top">{group.lead}</a>{/if}
							<div class="footer-columns">
								{#each group.columns as [label, links] (label)}
									<div>
										<h3 class="footer-label">{label}</h3>
										<ul>
											{#each links as link (link)}<li><a href="#top">{link}</a></li>{/each}
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
						<span>Documentation that keeps<br />up with large teams</span>
						<a class="pill ext:fs-16" data-size="large" data-variant="light" href="#top"
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
	.page {
		background: var(--ext-surface);
		color: var(--ext-ink);
		overflow-x: clip;
		font-family: var(--ff-sans);
		font-size: 0.875rem;
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
	/* suede's default sets article text in the serif content face and at --fs-2. */
	article p,
	article h3 {
		font-family: var(--ff-sans);
	}
	.icon {
		inline-size: var(--ext-size-icon);
		block-size: var(--ext-size-icon);
		flex: none;
		stroke-width: 1.5;
	}
	.chevron {
		inline-size: 0.75rem;
		block-size: 0.75rem;
		flex: none;
		opacity: 0.6;
	}
	.mono {
		font-family: var(--ff-mono);
		font-size: 0.625rem;
		font-weight: var(--fw-medium);
		letter-spacing: 0.02em;
	}
	.heading-32 {
		font-size: 2rem;
		line-height: 1.2;
		letter-spacing: var(--ext-tracking-display);
	}
	.heading-38 {
		font-size: 2.375rem;
		line-height: 1.05;
		letter-spacing: var(--ext-tracking-display);
	}

	.banner {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-medium);
		min-block-size: 2.375rem;
		background: var(--hue-neutral-200);
	}
	.site-header {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		max-inline-size: 71.5rem;
		margin-inline: auto;
		padding-block: 0.5rem;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		font-weight: var(--fw-medium);
		letter-spacing: var(--ext-tracking-display);
	}
	.primary-nav {
		display: flex;
		gap: 2rem;
		color: var(--ext-body);
	}
	.primary-nav a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
	.actions {
		display: flex;
		justify-content: end;
		align-items: center;
		gap: 0.5rem;
	}
	.quiet-link {
		padding-inline: 0.9375rem;
		color: var(--hue-stone-700);
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		min-block-size: 2rem;
		padding-inline: 1.25rem;
		border-radius: var(--radius-full);
		background: var(--ext-ink);
		color: var(--ext-surface);
	}
	.pill[data-variant='soft'] {
		background: var(--hue-stone-100);
		color: var(--ext-ink);
	}
	.pill[data-variant='faint'] {
		padding-inline: 0.9375rem;
		background: var(--hue-stone-100);
		color: var(--hue-stone-700);
	}
	.pill[data-size='large'] {
		min-block-size: 2.375rem;
		padding-inline: 0.875rem;
		letter-spacing: -0.03em;
	}

	.hero {
		display: grid;
		justify-items: center;
		text-align: center;
		padding-block-start: 2.125rem;
		padding-inline: var(--space-lg);
	}
	.announce {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-block-size: 2rem;
		padding: 0 0.5rem 0 0.375rem;
		border: var(--border-w-thin) solid var(--hue-stone-200);
		border-radius: var(--radius-xl);
		background: var(--ext-surface-soft);
		color: var(--ext-body);
	}
	.announce b {
		padding: 0.0625rem 0.4375rem;
		border-radius: var(--radius-full);
		background: var(--ext-accent);
		color: var(--hue-white);
		font-weight: var(--fw-regular);
	}
	.hero h1 {
		max-inline-size: 40rem;
		margin-block-start: 1.5rem;
		font-size: 3rem;
		line-height: 0.94;
		letter-spacing: -0.03em;
	}
	.hero em {
		color: var(--ext-accent);
		font-style: normal;
	}
	.lede {
		margin-block-start: 1.5rem;
		color: var(--ext-body);
	}
	.cta-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.625rem;
		margin-block-start: 1.5rem;
	}

	.logo-strip {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 5.5rem;
		align-items: center;
		min-block-size: 5rem;
		margin-block: 5.3rem 3.75rem;
		padding-inline: var(--space-lg);
		color: var(--hue-stone-500);
		font-weight: var(--fw-medium);
	}

	.demo {
		position: relative;
		max-inline-size: 70rem;
		margin-inline: auto;
	}
	.art {
		position: absolute;
		inset: 0;
	}
	.arc {
		position: absolute;
		inset-block-start: -1rem;
		inset-inline-start: 52%;
		inline-size: 21rem;
		block-size: 21rem;
		border-radius: 50%;
		background: var(--ext-accent);
		filter: blur(2px);
	}
	.band {
		position: absolute;
		inline-size: 50vw;
		block-size: 15rem;
		background:
			repeating-linear-gradient(
				176deg,
				transparent 0 2.75rem,
				color-mix(in oklch, var(--hue-white) 22%, transparent) 2.75rem 2.85rem
			),
			linear-gradient(175deg, var(--hue-orange-400), var(--ext-accent) 60%, var(--hue-orange-400));
	}
	.band[data-side='left'] {
		inset-block-start: 7rem;
		inset-inline-end: 96%;
		border-start-end-radius: 40%;
	}
	.band[data-side='right'] {
		inset-block-start: 11rem;
		inset-inline-start: 96%;
		border-end-start-radius: 40%;
	}
	.demo-tabs {
		position: relative;
		z-index: 2;
		display: flex;
		gap: 0.25rem;
		inline-size: fit-content;
		margin: 0 auto -1.25rem;
		padding: 0.25rem;
		border-radius: var(--radius-full);
		background: var(--ext-surface-soft);
		box-shadow: var(--shadow-z1);
	}
	.demo-tab {
		min-block-size: 1.875rem;
		padding-inline: 0.625rem;
		border: 0;
		border-radius: var(--radius-full);
		background: var(--hue-white);
		color: var(--ext-body);
		cursor: pointer;
	}
	.demo-tab[data-state='active'] {
		background: var(--ext-accent);
		color: var(--hue-white);
	}
	.window {
		position: relative;
		z-index: 1;
		padding: 0 0.5rem 0.5rem;
		border-radius: var(--radius-xl);
		background: color-mix(in oklch, var(--hue-stone-200) 75%, transparent);
		backdrop-filter: blur(1.5rem);
		box-shadow: var(--shadow-z2);
	}
	.traffic {
		display: flex;
		gap: 0.625rem;
		padding: 1rem 1rem 0.875rem;
	}
	.traffic i {
		inline-size: 0.6875rem;
		block-size: 0.6875rem;
		border-radius: var(--radius-full);
		background: var(--hue-stone-300);
	}
	.window-body {
		position: relative;
		display: grid;
		grid-template-columns: 1fr 20rem;
		block-size: 37.5rem;
		border-radius: var(--radius-lg);
		background: var(--ext-surface);
		overflow: hidden;
	}
	.window-body[hidden] {
		display: none;
	}
	.mock-top {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1.25rem;
		color: var(--ext-body);
	}
	.mock-top strong {
		color: var(--ext-ink);
		font-weight: var(--fw-medium);
	}
	.mock-search {
		flex: 0 1 12rem;
		margin-inline: auto;
		padding: 0.25rem 0.5rem;
		border: var(--border-w-thin) solid var(--hue-stone-200);
		border-radius: var(--radius-sm);
	}
	.mock-button {
		padding: 0.25rem 0.625rem;
		border: var(--border-w-thin) solid var(--hue-stone-200);
		border-radius: var(--radius-sm);
	}
	.mock-nav {
		display: flex;
		gap: 1.5rem;
		padding-inline: 1.25rem;
		border-block-end: var(--border-w-thin) solid var(--hue-stone-200);
		color: var(--ext-body);
	}
	.mock-nav span {
		padding-block: 0.5rem;
	}
	.mock-nav [data-active] {
		color: var(--ext-accent);
		border-block-end: var(--border-w-thin) solid var(--ext-accent);
	}
	.mock-site {
		min-inline-size: 0;
		overflow: hidden;
	}
	.mock-columns {
		display: grid;
		grid-template-columns: 12rem 1fr;
	}
	.mock-side {
		display: flex;
		flex-direction: column;
		gap: 0.8125rem;
		padding: 0.75rem 1.25rem;
		color: var(--ext-body);
	}
	.mock-side strong {
		color: var(--ext-ink);
	}
	.mock-side span {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.mock-side :global(svg) {
		inline-size: 0.875rem;
		block-size: 0.875rem;
		flex: none;
	}
	.mock-main {
		padding: 0.75rem 1.25rem;
	}
	.mock-main small {
		color: var(--ext-body);
	}
	.mock-main h2 {
		margin-block: 0.75rem 0.5rem;
	}
	.mock-main p {
		color: var(--hue-stone-700);
	}
	.mock-cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-block-start: 1.25rem;
	}
	.mock-card {
		display: grid;
		gap: 0.25rem;
		padding-block-end: 0.75rem;
		border: var(--border-w-thin) solid var(--hue-stone-100);
		border-radius: var(--radius-md);
	}
	.mock-card > :not(.mock-card-art) {
		padding-inline: 0.875rem;
	}
	.mock-card > span {
		color: var(--ext-body);
	}
	.mock-card-art {
		display: grid;
		place-items: center;
		block-size: 10.625rem;
		margin-block-end: 0.5rem;
		border-radius: var(--radius-md) var(--radius-md) 0 0;
		background: var(--hue-stone-100);
	}
	.mock-float {
		position: absolute;
		inset-block-end: 1rem;
		inset-inline-start: 33%;
	}
	.mock-chat {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem 1rem 1rem;
		border-inline-start: var(--border-w-thin) solid var(--hue-stone-200);
		color: var(--ext-body);
	}
	.mock-chat strong {
		color: var(--ext-ink);
		font-weight: var(--fw-medium);
	}
	.chat-hello {
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		margin-block: auto;
	}
	.chat-mark {
		display: grid;
		place-items: center;
		inline-size: 4rem;
		block-size: 4rem;
		margin-block-end: 0.5rem;
		border-radius: 50%;
		background: var(--hue-orange-100);
		color: var(--ext-ink);
	}
	.chat-suggestion {
		padding: 0.625rem 0.75rem;
		color: var(--ext-ink);
		border-radius: var(--radius-md);
		background: var(--hue-orange-50);
	}
	.chat-field {
		display: grid;
		gap: 1rem;
		margin-block-start: 0.5rem;
		padding: 0.75rem;
		border: var(--border-w-thin) solid var(--hue-orange-400);
		border-radius: var(--radius-xl);
	}
	.chat-field small {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--hue-stone-600);
	}
	.chat-field b {
		padding: 0.25rem 0.625rem;
		border-radius: var(--radius-full);
		background: var(--hue-orange-200);
		color: var(--ext-accent);
		font-weight: var(--fw-regular);
	}

	.get-started {
		display: grid;
		justify-items: center;
		padding: 7rem var(--space-lg) 0;
		text-align: center;
	}
	.assistant-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-block-start: 1.0625rem;
		padding: 1rem;
		border: var(--border-w-thin) solid var(--hue-orange-500);
		border-radius: 3.5rem;
		background: color-mix(in oklch, var(--ext-accent) 5%, transparent);
	}
	.assistant-row a {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-sm);
		inline-size: 14.4375rem;
		min-block-size: 2.375rem;
		border-radius: var(--radius-full);
		background: var(--ext-surface);
	}
	.setup-line {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-block-start: 1.25rem;
	}
	.copy {
		min-block-size: 1.75rem;
		padding-inline: 0.75rem;
		border: 0;
		border-radius: var(--radius-full);
		background: var(--ext-surface-soft);
		color: var(--ext-body);
		cursor: pointer;
	}

	.split {
		display: grid;
		grid-template-columns: 33.0625rem 35.4375rem;
		justify-content: space-between;
		align-items: center;
		max-inline-size: 72.5rem;
		margin-inline: auto;
		padding: 7.25rem 0 0;
	}
	.split[data-order='reversed'] {
		grid-template-columns: 35.4375rem 33.0625rem;
	}
	.split[data-order='reversed'] > :first-child {
		order: 2;
	}
	.split h2 {
		margin-block-start: 1rem;
	}
	.split[data-order='reversed'] h2 {
		margin-block-start: 0;
	}
	.split p {
		margin-block-start: 1rem;
		color: var(--ext-body);
		line-height: 1.6;
		letter-spacing: -0.01em;
		text-wrap: pretty;
	}
	.tracker {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-block-size: 2rem;
		padding: 0 0.75rem 0 0.375rem;
		border: var(--border-w-thin) solid var(--hue-stone-100);
		border-radius: var(--radius-xl);
		background: var(--ext-surface-soft);
	}
	.tracker b {
		padding: 0.0625rem 0.4375rem;
		border-radius: var(--radius-full);
		background: var(--ext-accent);
		color: var(--hue-white);
		font-weight: var(--fw-regular);
	}
	.tracker .mono {
		color: var(--ext-accent);
		font-size: 0.875rem;
		font-weight: var(--fw-semibold);
	}
	.visual {
		position: relative;
		block-size: 21.3125rem;
		border-radius: var(--radius-xl);
		background: var(--hue-neutral-50);
		overflow: hidden;
	}
	.visual-flare {
		position: absolute;
		inset-block: -3rem;
		inset-inline-end: -7.5rem;
		inline-size: 11rem;
		border-radius: 50%;
		background: linear-gradient(180deg, var(--hue-orange-500), var(--ext-accent));
	}
	.check-window {
		position: absolute;
		inset-block-start: 3.8125rem;
		inset-inline-start: 7.9375rem;
		inline-size: 40rem;
		block-size: 19.625rem;
		padding: 0.875rem 0.6875rem;
		border: var(--border-w-thin) dashed var(--hue-orange-400);
		border-radius: 1rem 1.25rem 1.25rem 0;
	}
	.traffic-colour {
		display: flex;
		gap: 0.375rem;
		margin-block-end: 1rem;
	}
	.traffic-colour i {
		inline-size: 0.5rem;
		block-size: 0.5rem;
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
		display: block;
		block-size: 0.75rem;
		margin-block-end: 0.4375rem;
		border-radius: var(--radius-sm);
		background: var(--ext-ok);
	}
	.bar[data-state='error'] {
		position: relative;
		background: var(--ext-accent);
	}
	.bar[data-state='error']::after {
		content: '⚠';
		position: absolute;
		inset-inline-start: calc(100% + 0.375rem);
		inset-block-start: -0.25rem;
		color: var(--ext-accent);
		font-size: 0.8125rem;
		line-height: 1;
	}
	.check-card {
		position: absolute;
		inset-block-start: 14.5rem;
		inset-inline-start: 2.75rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		inline-size: 20rem;
		min-block-size: 3.75rem;
		padding: 0 1.25rem 0 0.9375rem;
		border-radius: 0.75rem;
		background: var(--ext-surface);
		box-shadow: 0 0.2rem 1.85rem color-mix(in oklch, var(--hue-black) 15%, transparent);
		font-size: 1.0625rem;
		letter-spacing: -0.02em;
	}
	.check-card .icon {
		inline-size: 1.75rem;
		block-size: 1.75rem;
	}
	.check-card i {
		display: block;
		inline-size: 1.75rem;
		block-size: var(--border-w-standard);
		margin-block-start: 0.25rem;
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
		inline-size: 2.75rem;
		block-size: 2.75rem;
		border-radius: var(--radius-lg);
		background: var(--ext-surface-soft);
		box-shadow: 0 1px 2px color-mix(in oklch, var(--hue-black) 25%, transparent);
	}
	.tile :global(svg) {
		inline-size: 1.25rem;
		block-size: 1.25rem;
	}

	.system {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		justify-items: center;
		max-inline-size: 72.5rem;
		margin-inline: auto;
		padding-block-start: 7rem;
		text-align: center;
	}
	.system h2 {
		max-inline-size: 49.375rem;
	}
	.diagram {
		position: relative;
		display: grid;
		place-items: center;
		inline-size: 53.25rem;
		max-inline-size: 100%;
		block-size: 16.3125rem;
		margin-block-start: 4.125rem;
		border: var(--border-w-thin) dashed var(--hue-orange-400);
		border-radius: var(--radius-full);
		background: color-mix(in oklch, var(--ext-accent) 7%, transparent);
	}
	.diagram > .tile {
		position: absolute;
		background: var(--ext-surface);
	}
	.diagram > .tile[data-at='top'] {
		inset-block-start: -1.375rem;
	}
	.diagram > .tile[data-at='bottom'] {
		inset-block-end: -1.375rem;
	}
	.diagram > .tile[data-at='left'] {
		inset-inline-start: -1.375rem;
	}
	.diagram > .tile[data-at='right'] {
		inset-inline-end: -1.375rem;
	}
	.dash {
		position: absolute;
		block-size: var(--border-w-standard);
		background: var(--ext-accent);
	}
	.dash[data-at='top'] {
		inset-block-start: -1px;
		inset-inline-start: 50%;
		inline-size: 15rem;
	}
	.dash[data-at='left'] {
		inset-inline-start: 11.25rem;
		inline-size: 3rem;
	}
	.dash[data-at='right'] {
		inset-inline-end: 11.25rem;
		inline-size: 3rem;
	}
	.cube {
		inline-size: 9.25rem;
	}

	.pillars {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
		inline-size: 100%;
		margin-block-start: 4.625rem;
		text-align: start;
	}
	.pillar {
		display: flex;
		flex-direction: column;
		min-block-size: 20.625rem;
		padding: 1.5rem;
		border: var(--border-w-thin) solid var(--hue-stone-100);
		border-radius: var(--radius-xl);
	}
	.pillar h3 {
		margin-block-start: 1.125rem;
		font-size: 1.25rem;
		line-height: 1.3;
		letter-spacing: -0.02em;
	}
	.pillar p {
		flex: 1;
		margin-block-start: 0.625rem;
		color: var(--ext-body);
		font-size: 1rem;
		line-height: 1.5;
		text-wrap: pretty;
	}
	.tag {
		align-self: start;
		display: inline-flex;
		align-items: center;
		min-block-size: 2.25rem;
		padding-inline: 0.875rem;
		border-radius: var(--radius-full);
		background: color-mix(in oklch, var(--hue-black) 4%, transparent);
		font-size: 1rem;
		letter-spacing: -0.03em;
	}

	.quote {
		display: grid;
		grid-template-columns: 10.875rem 34.5rem;
		gap: 2.5rem;
		align-items: start;
		justify-content: center;
		padding-block-start: 7rem;
	}
	.portrait {
		display: grid;
		justify-items: center;
		gap: 0.5rem;
		padding: 0.625rem 0.625rem 0.875rem;
		border: var(--border-w-thin) solid var(--hue-stone-100);
		border-radius: var(--radius-lg);
		background: var(--ext-surface-soft);
		font-size: 1.125rem;
	}
	.portrait i {
		inline-size: 5rem;
		block-size: 5rem;
		border-radius: 50%;
		background: var(--hue-stone-200);
	}
	.portrait b {
		font-weight: var(--fw-medium);
	}
	.quote blockquote {
		margin: 0;
	}
	.quote p {
		font-family: var(--ff-sans);
		font-size: 1.5rem;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-wrap: pretty;
	}
	.quote footer {
		margin-block: 0.5625rem 1.5rem;
		color: var(--hue-stone-600);
		font-size: 1rem;
	}
	.quote footer span {
		color: var(--ext-ink);
	}

	.enterprise-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		justify-items: center;
		max-inline-size: 72.5rem;
		margin-inline: auto;
		padding-block-start: 7rem;
		text-align: center;
	}
	.enterprise-section > p {
		margin-block-start: 1rem;
		color: var(--ext-body);
		line-height: 1.6;
	}
	.enterprise-section > .pill {
		margin-block-start: 1rem;
	}
	.enterprise {
		display: grid;
		grid-template-columns: 14.5rem 1fr 14.5rem;
		grid-template-rows: 18.125rem 11.875rem;
		column-gap: 2rem;
		inline-size: 100%;
		margin-block-start: 3rem;
		text-align: start;
	}
	.enterprise article:nth-child(1) {
		grid-area: 1 / 1;
	}
	.enterprise article:nth-child(2) {
		grid-area: 1 / 3;
	}
	.enterprise article:nth-child(3) {
		grid-area: 2 / 1;
	}
	.enterprise article:nth-child(4) {
		grid-area: 2 / 3;
	}
	.enterprise h3 {
		margin-block-start: 1.125rem;
		font-size: 1.25rem;
		line-height: 1.3;
		letter-spacing: -0.02em;
	}
	.enterprise p {
		margin-block-start: 0.5rem;
		color: var(--ext-body);
		font-size: 1rem;
		line-height: 1.5;
		font-family: var(--ff-sans);
	}
	.enterprise-art {
		grid-area: 1 / 2 / 3 / 3;
		display: grid;
		place-items: center;
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
		margin-block-start: 3.0625rem;
		font-size: 1.5rem;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}
	.metrics {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		inline-size: 100%;
		margin: 1.75rem 0 4.25rem;
		text-align: start;
	}
	.metrics > div {
		display: grid;
		grid-template-columns: 1.25rem 1fr;
		column-gap: 0.5rem;
		align-items: center;
		padding-inline: 0.875rem 2rem;
		border-inline-start: var(--border-w-thin) solid var(--hue-stone-100);
	}
	.metrics dt {
		grid-column: 1 / -1;
		margin-block-end: 2.25rem;
		font-size: 1.5rem;
		font-weight: var(--fw-medium);
		letter-spacing: -0.02em;
	}
	.metrics dd {
		margin: 0;
	}
	.metric-tile {
		display: grid;
		place-items: center;
		block-size: 1.25rem;
		font-size: 0.75rem;
		border-radius: var(--radius-xs);
		background: var(--ext-accent);
		color: var(--hue-white);
	}
	.metric-value {
		color: var(--ext-accent);
		font-size: 1.125rem;
	}
	.metric-label {
		grid-column: 2;
		max-inline-size: 11rem;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.customers {
		max-inline-size: 72.5rem;
		margin-inline: auto;
		padding-block-start: 9.5rem;
	}
	.eyebrow {
		color: var(--ext-accent);
		font-family: var(--ff-mono);
		font-size: 0.75rem;
		font-weight: var(--fw-semibold);
		text-transform: uppercase;
	}
	.customers-head {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 2rem;
		margin-block-start: 0.75rem;
	}
	.customers-head h2 {
		max-inline-size: 38rem;
	}
	.customer-row {
		display: flex;
		gap: 1.5rem;
		margin-block-start: 2.5rem;
		margin-inline-end: calc((100vw - 72.5rem) / -2);
		overflow-x: auto;
		scrollbar-width: none;
	}
	.customer-row li {
		position: relative;
		flex: none;
		display: grid;
		place-items: center;
		inline-size: 20rem;
		block-size: 20rem;
		border: var(--border-w-thin) solid var(--hue-stone-100);
		border-radius: var(--radius-lg);
		background: var(--ext-surface-soft);
	}
	.customer-row b {
		font-size: 1.75rem;
		font-weight: var(--fw-medium);
		letter-spacing: -0.02em;
	}
	.round {
		position: absolute;
		inset-block-end: 1.25rem;
		display: grid;
		place-items: center;
		inline-size: 2.25rem;
		block-size: 2.25rem;
		border-radius: 50%;
		background: var(--hue-stone-100);
	}
	.pager {
		display: flex;
		gap: 0.25rem;
		margin-inline-end: auto;
	}
	.pager i {
		inline-size: 0.5rem;
		block-size: 0.1875rem;
		border-radius: var(--radius-full);
		background: var(--hue-stone-400);
	}
	.pager i:first-child {
		inline-size: 1.25rem;
		background: var(--ext-ink);
	}
	.carousel-nav {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 1rem;
		margin-block-start: 1.5rem;
	}
	.carousel-nav button {
		inline-size: 2.5rem;
		block-size: 2.5rem;
		border: 0;
		border-radius: 50%;
		background: var(--hue-neutral-100);
		cursor: pointer;
	}

	.watermark {
		position: absolute;
		inset: 50% auto auto 50%;
		translate: -50% -50%;
		inline-size: 34rem;
		color: var(--hue-neutral-100);
	}
	.closing > :not(.watermark) {
		position: relative;
	}
	.closing {
		position: relative;
		margin-block-start: 8rem;
		padding: 14.25rem var(--space-lg);
		background: var(--ext-surface-soft);
		text-align: center;
	}
	.closing h2 {
		font-size: 2.8125rem;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.closing p {
		margin-block-start: 1.5rem;
		color: var(--hue-stone-600);
		font-size: 1rem;
		line-height: 1.5;
	}

	.site-footer {
		margin-block-start: 8rem;
		padding: 4rem 2.5rem 2rem;
		background: var(--ext-surface-soft);
	}
	.footer-inner {
		max-inline-size: 72.5rem;
		margin-inline: auto;
	}
	.footer-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.socials,
	.summary-icons {
		display: flex;
		gap: 1.25rem;
	}
	.socials i,
	.summary-icons i {
		inline-size: 1.25rem;
		block-size: 1.25rem;
		border-radius: 50%;
		background: var(--hue-stone-600);
	}
	.footer-main {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 17.5rem;
		gap: 0.75rem;
		margin-block-start: 2.25rem;
	}
	.footer-group + .footer-group {
		margin-block-start: 2rem;
	}
	.footer-group h2 {
		font-size: 1.25rem;
		line-height: 1.3;
		letter-spacing: -0.02em;
	}
	.footer-lead {
		display: block;
		margin-block-start: 0.875rem;
		color: var(--hue-stone-600);
	}
	.footer-columns {
		display: grid;
		grid-template-columns: 19.1875rem 19.1875rem minmax(0, 1fr);
		margin-block-start: 1.5rem;
	}
	.footer-columns > div + div {
		margin-inline-start: -2.4rem;
		padding-inline-start: 2.4rem;
		border-inline-start: var(--border-w-thin) solid var(--hue-stone-200);
	}
	.footer-label {
		color: var(--ext-accent);
		font-family: var(--ff-mono);
		font-size: 0.75rem;
		font-weight: var(--fw-semibold);
		line-height: 1;
		text-transform: uppercase;
	}
	.footer-columns ul {
		display: grid;
		gap: 0.9rem;
		margin-block-start: 1.0625rem;
		color: var(--hue-stone-600);
		line-height: 1.6;
	}
	.promos {
		display: grid;
		align-content: start;
		gap: 1.25rem;
	}
	.promo {
		display: grid;
		justify-items: start;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: var(--radius-lg);
		background: color-mix(in oklch, var(--ext-accent) 7%, transparent);
		line-height: 1.55;
	}
	.promo strong {
		font-size: 1rem;
		font-weight: var(--fw-medium);
	}
	.promo > a:not(.pill) {
		text-decoration: underline;
		text-decoration-color: var(--ext-accent);
		text-underline-offset: 0.25em;
	}
	.promo-mark {
		inline-size: 1.75rem;
	}
	.promo[data-tone='accent'] {
		padding-block-start: 0.75rem;
		background: var(--ext-accent);
		color: var(--hue-white);
	}
	.pill[data-variant='light'] {
		background: var(--hue-white);
		color: var(--hue-stone-950);
	}
	.promo-logo {
		display: grid;
		place-items: center;
		inline-size: 11.5rem;
		block-size: 3.125rem;
		border-radius: var(--radius-sm);
		background: var(--hue-blue-800);
		color: var(--hue-white);
		font-style: normal;
		font-size: 1.25rem;
	}
	.promo-icon {
		inline-size: 3.125rem;
		block-size: 3.125rem;
		border-radius: var(--radius-lg);
		background: linear-gradient(135deg, var(--hue-light-blue-400), var(--ext-accent));
	}
	.badges {
		display: flex;
		gap: 1.75rem;
		margin-block-start: 1.75rem;
	}
	.badges i {
		inline-size: 3.625rem;
		block-size: 3.625rem;
		border-radius: 50%;
		border: var(--border-w-standard) solid var(--hue-stone-500);
	}
	.fine {
		margin-block-start: 1.25rem;
		color: var(--hue-stone-600);
		font-size: 0.75rem;
		line-height: 2.1;
	}
	.summary-title {
		margin-block-start: 1.5rem;
		font-size: 1rem;
	}
	.summary-icons {
		margin-block-start: 0.75rem;
	}
	.legal {
		display: flex;
		flex-wrap: wrap;
		gap: 1.75rem;
		margin-block-start: 2.5rem;
		color: var(--hue-stone-600);
		font-size: 0.75rem;
	}

	@media (max-width: 76rem) {
		.system,
		.enterprise-section,
		.customers,
		.quote,
		.split,
		.split[data-order='reversed'] {
			padding-inline: var(--space-lg);
		}
		.customer-row {
			margin-inline-end: 0;
		}
		.site-footer {
			padding-inline: var(--space-lg);
		}
	}
	@media (max-width: 60rem) {
		.split,
		.split[data-order='reversed'] {
			padding-block-start: 4rem;
		}
		.pillars,
		.metrics {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
		.pillar {
			min-block-size: 0;
			gap: 0.5rem;
		}
		.diagram {
			margin-block-start: 3rem;
		}
		.dash[data-at='left'],
		.dash[data-at='right'] {
			display: none;
		}
		.quote {
			grid-template-columns: minmax(0, 1fr);
			padding-block-start: 4rem;
		}
		.portrait {
			justify-self: start;
			inline-size: 10.875rem;
		}
		.enterprise {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: none;
			row-gap: 2rem;
		}
		.enterprise article:nth-child(n),
		.enterprise-art {
			grid-area: auto;
		}
		.enterprise-art {
			min-block-size: 16rem;
		}
		.customers-head {
			flex-direction: column;
			align-items: start;
		}
		.closing {
			padding-block: 6rem;
		}
		.closing h2 {
			font-size: 2.25rem;
		}
		.footer-main,
		.footer-columns {
			grid-template-columns: minmax(0, 1fr);
		}
		.footer-columns {
			gap: 1.5rem;
		}
		.footer-columns > div + div {
			margin-inline-start: 0;
			padding-inline-start: 0;
			border: 0;
		}
	}
</style>
