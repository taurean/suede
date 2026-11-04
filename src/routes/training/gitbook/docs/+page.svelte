<!-- Training prototype: design-training round "gitbook", docs page layout study. Copy and brand are invented. Rem offsets are measured from the reference at 1440px. Deleted when training graduates. -->
<script lang="ts">
	import '../suede-extensions.css';

	const sections = [
		{
			heading: 'Build a custom plugin',
			links: [
				['Quickstart', false],
				['Install the tools', true],
				['Configure', false],
				['Develop', true],
				['Release your plugin', false],
				['Request a review', false],
				['Concepts', false],
				['Guides', true]
			]
		},
		{
			heading: 'Platform API',
			links: [
				['Quickstart', false],
				['API reference', true],
				['Tokens', false],
				['Limits', false],
				['Paging', false],
				['Errors', false]
			]
		}
	] as const;
	const current = 'Release your plugin';
	const toc = [
		'Releasing to your whole team',
		'Adding your plugin',
		'Shipping new versions',
		'Sharing your plugin with other teams',
		"Listing in Foldline's public plugin directory"
	];
	const requiredKeys = ['id', 'label', 'summary', 'audience', 'entry', 'permissions'];
	const audiences = [
		[
			'team',
			'The default for new plugins. Only people on the team named in the manifest can add the plugin to a space.'
		],
		[
			'link',
			'Anyone with the share link can add the plugin. It stays out of search and is only reachable through that link.'
		],
		[
			'everyone',
			'Anyone can add the plugin to a space. Plugins that want a directory listing must use this setting.'
		]
	];
	const footer = [
		['Explore', ['Examples', 'Customers', 'Status']],
		['Company', ['Careers', 'Blog', 'Forum']],
		['Legal', ['Vendors', 'Terms of use']]
	] as const;
</script>

<svelte:head><title>Release your plugin</title></svelte:head>

{#snippet chevron()}
	<svg class="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"
		><path d="M4 6l4 4 4-4" /></svg
	>
{/snippet}

{#snippet mark(size: string)}
	<svg style:inline-size={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
		><path d="M8 1l7 4-7 4-7-4zM1 8l7 4 7-4v3l-7 4-7-4z" /></svg
	>
{/snippet}

<div class="page">
	<p class="notice ext:fs-14">
		<i class="dot"></i> Scheduled maintenance this Saturday. See the <a href="#top">status page</a>
		↗ <button aria-label="Dismiss notice">×</button>
	</p>

	<header class="top" id="top">
		<div class="top-row">
			<a class="brand ext:fs-18" href="#top">{@render mark('1.5rem')} Foldline</a>
			<div class="search ext:fs-14">
				<label class="search-field">
					<span class="u:visually-hidden">Search docs</span>
					<input type="search" placeholder="Search…" />
					<span class="keys" aria-hidden="true"><kbd>⌘</kbd><kbd>K</kbd></span>
				</label>
				<a class="outline-pill" href="#top">Ask</a>
			</div>
			<nav class="top-links ext:fs-14" aria-label="Site">
				<a href="#top">Product {@render chevron()}</a>
				<a href="#top">Pricing</a>
				<a href="#top">Book a demo</a>
				<a class="outline-pill" href="#top">Log in</a>
				<a class="accent-pill" href="#top">Sign up</a>
			</nav>
		</div>
		<nav class="doc-tabs ext:fs-14" aria-label="Documentation areas">
			<a href="#top"><i class="tab-icon"></i> Documentation</a>
			<a href="#top" aria-current="true"><i class="tab-icon"></i> Developers</a>
			<a href="#top"><i class="tab-icon"></i> Resources {@render chevron()}</a>
		</nav>
	</header>

	<div class="columns">
		<aside class="sidebar ext:fs-14">
			<nav aria-label="Pages">
				<a href="#top">Developer documentation</a>
				{#each sections as section (section.heading)}
					<h2 class="ext:fs-12">{section.heading}</h2>
					{#each section.links as [link, nested] (link)}
						<a href="#top" aria-current={link === current ? 'page' : undefined}
							>{link}{#if nested}<span class="nested">›</span>{/if}</a
						>
					{/each}
				{/each}
			</nav>
			<a class="powered" href="#top">{@render mark('1.25rem')} Powered by Foldline</a>
		</aside>

		<main class="content">
			<div class="crumb-row">
				<p class="crumbs ext:fs-12">Developers <span>›</span> Build a custom plugin</p>
				<div class="ask ext:fs-14">
					<a href="#top">Ask</a><button aria-label="More options">{@render chevron()}</button>
				</div>
			</div>
			<h1>Release your plugin</h1>
			<p class="lede ext:fs-18">
				Make your plugins available to your team or to everyone on Foldline
			</p>
			<p>Once your plugin works locally, you can release it for use inside Foldline.</p>

			<h2 id="team">Releasing to your whole team</h2>
			<p>
				A release publishes your plugin to Foldline using the settings defined in your project's <code
					>foldline-plugin.yaml</code
				> file.
			</p>
			<p>Before releasing, the file needs these keys:</p>
			<ul>
				{#each requiredKeys as key (key)}<li><code>{key}</code></li>{/each}
			</ul>

			<h2 id="add">Adding your plugin</h2>
			<p>
				After a successful release, the console prints a link where you can find your plugin and add
				it to any space you manage.
			</p>

			<h2 id="versions">Shipping new versions</h2>
			<p>
				Whenever you have changes to ship, run <code>foldline release</code> from your plugin's project
				directory.
			</p>

			<h2 id="sharing">Sharing your plugin with other teams</h2>
			<p>
				To share or test a plugin more widely, change the <code>audience</code> key in your
				project's <code>foldline-plugin.yaml</code> file.
			</p>
			<table class="ext:fs-14">
				<thead><tr><th>Audience</th><th>Who can add it</th></tr></thead>
				<tbody>
					{#each audiences as [name, description] (name)}
						<tr><td><code>{name}</code></td><td>{description}</td></tr>
					{/each}
				</tbody>
			</table>

			<h2 id="directory">Listing in Foldline's public plugin directory</h2>
			<p>
				To appear in the directory, your plugin first needs to go through a short review with our
				team.
			</p>
			<p>See <a class="text-link" href="#top">requesting a review</a> for the steps.</p>
			<p class="updated ext:fs-14">Last updated 1 year ago</p>
		</main>

		<aside class="toc ext:fs-14">
			<h2 class="ext:fs-12">On this page</h2>
			<ol>
				{#each toc as item, i (item)}
					<li><a href="#top" aria-current={i === 0 ? 'location' : undefined}>{item}</a></li>
				{/each}
			</ol>
			<p>Was this helpful?</p>
			<div class="helpful">
				<button aria-label="Yes"></button><button aria-label="Somewhat"></button><button
					aria-label="No"
				></button>
			</div>
		</aside>
	</div>

	<footer class="site-footer ext:fs-14">
		<a class="footer-brand" href="#top">{@render mark('3rem')} Foldline</a>
		{#each footer as [heading, links] (heading)}
			<nav aria-label={heading}>
				<h2 class="ext:fs-14">{heading}</h2>
				{#each links as link (link)}<a href="#top">{link}</a>{/each}
			</nav>
		{/each}
		<div class="socials" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
	</footer>
</div>

<style>
	.page {
		--muted: light-dark(var(--hue-neutral-700), var(--hue-neutral-500));
		--line: light-dark(var(--hue-neutral-200), var(--hue-neutral-800));
		min-block-size: 100vh;
		padding-block-start: 1rem;
		background: var(--ext-surface);
		color: var(--ext-ink);
		font-family: var(--ff-sans);
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	h1,
	h2,
	p {
		margin: 0;
		font-weight: var(--fw-regular);
	}
	button {
		border: 0;
		background: none;
		color: inherit;
		cursor: pointer;
	}
	.chevron {
		display: inline-block;
		inline-size: 0.75rem;
		opacity: 0.6;
		vertical-align: middle;
	}

	.notice {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.375rem;
		position: relative;
		min-block-size: 2.75rem;
		margin-inline: 2rem;
		border-radius: var(--radius-lg);
		background: var(--hue-neutral-100);
	}
	.notice a,
	.text-link {
		text-decoration: underline;
		text-decoration-color: var(--ext-accent);
		text-underline-offset: 0.25em;
	}
	.notice button {
		position: absolute;
		inset-inline-end: 1rem;
		color: var(--muted);
		font-size: 1.25rem;
	}
	.dot {
		inline-size: 1rem;
		block-size: 1rem;
		margin-inline-end: 0.375rem;
		border: var(--border-w-thin) solid var(--muted);
		border-radius: 50%;
	}

	.top {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		background: var(--ext-surface);
		border-block-end: var(--border-w-thin) solid var(--line);
	}
	.top-row {
		display: grid;
		grid-template-columns: 18rem minmax(0, 30.25rem) 1fr;
		column-gap: 3rem;
		align-items: center;
		padding: 1.25rem 2rem 0.75rem;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: var(--fw-medium);
		letter-spacing: var(--ext-tracking-display);
	}
	.search {
		display: flex;
		gap: 0.5rem;
	}
	.search-field {
		position: relative;
		flex: 1;
	}
	.search-field input {
		inline-size: 100%;
		min-block-size: 2.4375rem;
		padding-inline: 1rem;
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-full);
		background: transparent;
	}
	.keys {
		position: absolute;
		inset-block-start: 50%;
		inset-inline-end: 0.875rem;
		translate: 0 -50%;
		display: flex;
		gap: 0.25rem;
	}
	kbd {
		padding-inline: 0.3125rem;
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-sm);
		color: var(--muted);
		font-size: 0.6875rem;
	}
	.top-links {
		display: flex;
		justify-content: end;
		align-items: center;
		gap: 1.5rem;
		color: var(--muted);
	}
	.outline-pill,
	.accent-pill {
		display: inline-flex;
		align-items: center;
		min-block-size: 2.4375rem;
		padding-inline: 1.0625rem;
		border-radius: var(--radius-full);
	}
	.outline-pill {
		border: var(--border-w-thin) solid var(--line);
		color: var(--muted);
	}
	.accent-pill {
		background: var(--ext-accent);
		color: var(--hue-white);
	}
	.doc-tabs {
		display: flex;
		gap: 2rem;
		padding-inline: 2rem;
		color: var(--muted);
	}
	.doc-tabs a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-block: 0.75rem;
		border-block-end: var(--border-w-thin) solid transparent;
	}
	.doc-tabs [aria-current] {
		color: var(--ext-accent);
		border-color: var(--ext-accent);
	}
	.tab-icon {
		inline-size: 0.875rem;
		block-size: 0.875rem;
		border: var(--border-w-thin) solid currentColor;
		border-radius: var(--radius-xs);
	}

	.columns {
		display: grid;
		grid-template-columns: 18rem minmax(0, 48rem) 16rem;
		padding: 2rem 2rem 2.5rem;
	}
	.sidebar nav {
		display: grid;
		border-inline-start: var(--border-w-thin) solid var(--line);
	}
	.sidebar nav a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-block-size: 2rem;
		padding-inline: 0.75rem 1.25rem;
		margin-block-end: 0.125rem;
		color: var(--muted);
	}
	.nested {
		font-size: 1rem;
	}
	.sidebar h2 {
		margin-block-start: 1rem;
		padding: 0.5rem 0.75rem;
		font-weight: var(--fw-medium);
		text-transform: uppercase;
	}
	.sidebar [aria-current] {
		margin-inline-start: calc(var(--border-w-thin) * -1);
		border-inline-start: var(--border-w-thin) solid var(--ext-accent);
		color: var(--ext-accent);
		font-weight: var(--fw-medium);
	}
	.powered {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-block-size: 3.125rem;
		margin-block-start: 0.75rem;
		padding-inline: 1rem;
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-full);
		color: var(--muted);
	}

	.content {
		margin-inline-start: 3rem;
		font-size: 1rem;
		line-height: 1.625;
	}
	.crumb-row {
		margin-block-start: -0.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-block-size: 1.8125rem;
	}
	.crumbs {
		color: var(--muted);
	}
	.crumbs span {
		margin-inline: 0.375rem;
	}
	.ask {
		display: flex;
		align-items: center;
		min-block-size: 1.8125rem;
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-full);
		color: var(--muted);
	}
	.ask a {
		padding-inline: 1rem 0.5rem;
	}
	.ask button {
		padding-inline: 0.375rem;
		border-inline-start: var(--border-w-thin) solid var(--line);
	}
	.content h1 {
		margin-block-start: 0.5rem;
		font-size: 2.25rem;
		line-height: 1.2;
		letter-spacing: var(--ext-tracking-display);
	}
	.content .lede {
		margin-block: 0.75rem 1.25rem;
		color: var(--muted);
		line-height: 1.5;
	}
	.content p + p {
		margin-block-start: 1.1875rem;
	}
	.content h2 {
		margin-block: 2.75rem 1.1875rem;
		font-size: 1.5rem;
		line-height: 1.33;
		letter-spacing: var(--ext-tracking-display);
	}
	.content ul {
		display: grid;
		gap: 0.5rem;
		margin-block-start: 1.1875rem;
		padding-inline-start: 1.75rem;
		line-height: 1.5;
	}
	code {
		padding: 0 0.3125rem;
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-sm);
		background: var(--hue-neutral-100);
		font-family: var(--ff-mono);
		font-size: 0.875em;
		white-space: nowrap;
	}
	table {
		inline-size: 100%;
		margin-block-start: 1.25rem;
		border-collapse: separate;
		border-spacing: 0;
		line-height: 1.5;
	}
	th {
		padding: 0.5rem 0.75rem;
		border-block: var(--border-w-thin) solid var(--line);
		background: var(--hue-neutral-100);
		font-weight: var(--fw-regular);
		text-align: start;
	}
	th:first-child {
		border-inline-start: var(--border-w-thin) solid var(--line);
		border-start-start-radius: var(--radius-md);
		border-end-start-radius: var(--radius-md);
	}
	th:last-child {
		border-inline-end: var(--border-w-thin) solid var(--line);
		border-start-end-radius: var(--radius-md);
		border-end-end-radius: var(--radius-md);
	}
	td {
		padding: 0.75rem;
		border-block-end: var(--border-w-thin) solid var(--line);
		vertical-align: top;
	}
	td:first-child {
		inline-size: 32%;
		border-inline-end: var(--border-w-thin) solid var(--line);
	}
	tr:last-child td {
		border-block-end: 0;
	}
	.updated {
		color: var(--muted);
	}

	.toc {
		margin-inline-start: 1rem;
	}
	.toc h2 {
		padding-block: 0.25rem 1rem;
		color: var(--muted);
		font-weight: var(--fw-medium);
		text-transform: uppercase;
	}
	.toc ol {
		display: grid;
		gap: 1rem;
		margin: 0;
		padding: 0 0 1.5rem;
		list-style: none;
		border-inline-start: var(--border-w-thin) solid var(--line);
		border-block-end: var(--border-w-thin) solid var(--line);
	}
	.toc a {
		display: block;
		padding-inline: 0.875rem 0.5rem;
		color: var(--muted);
		line-height: 1.45;
	}
	.toc [aria-current] {
		margin-inline-start: calc(var(--border-w-thin) * -1);
		padding-block: 0.25rem;
		border-inline-start: var(--border-w-standard) solid var(--ext-accent);
		color: var(--ext-accent);
	}
	.toc p {
		margin-block-start: 1.75rem;
		color: var(--muted);
	}
	.helpful {
		display: inline-flex;
		gap: 0.5rem;
		margin-block-start: 0.625rem;
		padding: 0.25rem 0.5rem;
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-full);
		color: var(--muted);
	}
	.helpful button {
		inline-size: 1.25rem;
		block-size: 1.25rem;
		padding: 0;
		border-radius: 50%;
		background: var(--hue-neutral-300);
	}

	.site-footer {
		display: grid;
		grid-template-columns: 18rem repeat(3, 1fr);
		column-gap: 3rem;
		padding: 2.5rem 2rem 3rem;
		border-block-start: var(--border-w-thin) solid var(--line);
	}
	.footer-brand {
		display: inline-flex;
		align-items: center;
		align-self: start;
		gap: 0.75rem;
		font-size: 2.25rem;
		font-weight: var(--fw-medium);
		line-height: 1;
		letter-spacing: var(--ext-tracking-display);
	}
	.site-footer nav {
		display: grid;
		gap: 1rem;
		align-content: start;
		color: var(--muted);
	}
	.site-footer h2 {
		color: var(--ext-ink);
	}
	.socials {
		grid-column: 1 / -1;
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-block-start: 3.5rem;
	}
	.socials i {
		inline-size: 1.5rem;
		block-size: 1.5rem;
		border-radius: var(--radius-sm);
		background: var(--muted);
	}

	@media (max-width: 70rem) {
		.toc,
		.top-links a:not(.accent-pill) {
			display: none;
		}
		.top-row {
			grid-template-columns: auto minmax(0, 1fr) auto;
			column-gap: 1rem;
		}
		.columns {
			grid-template-columns: 16rem minmax(0, 1fr);
		}
	}
	@media (max-width: 48rem) {
		.sidebar,
		.top-links,
		.keys {
			display: none;
		}
		.top-row {
			grid-template-columns: minmax(0, 1fr);
			row-gap: 0.75rem;
		}
		.columns,
		.site-footer {
			grid-template-columns: minmax(0, 1fr);
			row-gap: 1.5rem;
		}
		.content {
			margin-inline-start: 0;
		}
		.notice {
			margin-inline: 1rem;
			padding: 0.5rem 2.25rem;
			text-align: center;
			flex-wrap: wrap;
		}
		.top-row,
		.doc-tabs,
		.columns,
		.site-footer {
			padding-inline: 1rem;
		}
		.doc-tabs {
			gap: 1.25rem;
			overflow-x: auto;
		}
		table {
			display: block;
			overflow-x: auto;
		}
	}
</style>
