<!-- Training prototype: type and space test, docs page layout study. Copy and brand are invented. Deleted when training graduates. -->
<script lang="ts">
	import '../extensions.css';

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
{#snippet mark()}
	<svg class="mark" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
		><path d="M8 1l7 4-7 4-7-4zM1 8l7 4 7-4v3l-7 4-7-4z" /></svg
	>
{/snippet}

<div class="page">
	<div class="inner notice-row">
		<p class="notice">
			<span>Scheduled maintenance this Saturday. See the <a href="#top">status page</a> ↗</span
			><button aria-label="Dismiss notice">×</button>
		</p>
	</div>

	<header class="top" id="top">
		<div class="inner top-row">
			<a class="brand" href="#top">{@render mark()} Foldline</a>
			<div class="search">
				<label class="search-field">
					<span class="u:visually-hidden">Search docs</span>
					<input type="search" placeholder="Search…" />
				</label>
				<a class="outline-pill u:radius-full" href="#top">Ask</a>
			</div>
			<nav class="top-links" aria-label="Site">
				<a href="#top">Product {@render chevron()}</a>
				<a href="#top">Pricing</a>
				<a href="#top">Book a demo</a>
				<a class="outline-pill u:radius-full" href="#top">Log in</a>
				<a class="accent-pill u:radius-full" href="#top">Sign up</a>
			</nav>
		</div>
		<nav class="inner doc-tabs" aria-label="Documentation areas">
			<a href="#top">Documentation</a>
			<a href="#top" aria-current="true">Developers</a>
			<a href="#top">Resources {@render chevron()}</a>
		</nav>
	</header>

	<div class="inner columns">
		<aside class="sidebar">
			<nav aria-label="Pages">
				<a href="#top">Developer documentation</a>
				{#each sections as section (section.heading)}
					<h2>{section.heading}</h2>
					{#each section.links as [link, nested] (link)}
						<a href="#top" aria-current={link === current ? 'page' : undefined}
							>{link}{#if nested}<span>›</span>{/if}</a
						>
					{/each}
				{/each}
			</nav>
			<a class="powered" href="#top">{@render mark()} Powered by Foldline</a>
		</aside>

		<main class="content">
			<div class="crumb-row">
				<p class="crumbs">Developers › Build a custom plugin</p>
				<div class="ask">
					<a href="#top">Ask</a><button aria-label="More options">{@render chevron()}</button>
				</div>
			</div>
			<h1>Release your plugin</h1>
			<p class="lede">Make your plugins available to your team or to everyone on Foldline</p>
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
			<div class="table-scroll">
				<table>
					<thead><tr><th>Audience</th><th>Who can add it</th></tr></thead>
					<tbody>
						{#each audiences as [name, description] (name)}
							<tr><td><code>{name}</code></td><td>{description}</td></tr>
						{/each}
					</tbody>
				</table>
			</div>

			<h2 id="directory">Listing in Foldline's public plugin directory</h2>
			<p>
				To appear in the directory, your plugin first needs to go through a short review with our
				team.
			</p>
			<p>See <a class="text-link" href="#top">requesting a review</a> for the steps.</p>
			<p class="updated">Last updated 1 year ago</p>
		</main>

		<aside class="toc">
			<h2>On this page</h2>
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

	<footer class="site-footer">
		<div class="inner footer-grid">
			<a class="footer-brand" href="#top">{@render mark()} Foldline</a>
			{#each footer as [heading, links] (heading)}
				<nav aria-label={heading}>
					<h2>{heading}</h2>
					{#each links as link (link)}<a href="#top">{link}</a>{/each}
				</nav>
			{/each}
		</div>
		<div class="socials" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
	</footer>
</div>

<style>
	.page {
		--muted: light-dark(var(--hue-neutral-700), var(--hue-neutral-500));
		--line: light-dark(var(--hue-neutral-200), var(--hue-neutral-800));
		min-block-size: 100vh;
		background: var(--ext-surface);
		color: var(--ext-ink);
		font-family: var(--ff-sans);
		font-size: var(--text-sm);
		line-height: var(--leading-ui);
	}
	/* Rules and backgrounds reach the viewport edge. Only the content stops at 1440px. */
	.inner {
		box-sizing: border-box;
		max-inline-size: var(--page-max);
		margin-inline: auto;
		padding-inline: var(--gap-2xl);
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
		font: inherit;
		cursor: pointer;
	}
	.chevron {
		inline-size: 0.75em;
		block-size: 0.75em;
		opacity: 0.6;
	}
	.mark {
		inline-size: 1.25em;
		block-size: 1.25em;
		flex: none;
	}

	.notice-row {
		padding-block-start: var(--gap-lg);
	}
	.notice {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--gap-md);
		padding: var(--gap-md) var(--gap-lg);
		border-radius: var(--radius-lg);
		background: var(--hue-neutral-100);
		line-height: var(--leading-tight);
		text-align: center;
	}
	.notice span {
		flex: 1;
	}
	.notice a,
	.text-link {
		text-decoration: underline;
		text-decoration-color: var(--ext-accent);
		text-underline-offset: 0.25em;
	}
	.notice button {
		color: var(--muted);
		font-size: var(--text-xl);
	}

	.top {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		background: var(--ext-surface);
		border-block-end: var(--border-w-thin) solid var(--line);
	}
	.top-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gap-md) var(--gap-2xl);
		padding-block: var(--gap-lg) var(--gap-md);
	}
	.brand {
		flex: 1 1 auto;
		display: inline-flex;
		align-items: center;
		gap: var(--gap-sm);
		font-size: var(--text-xl);
		font-weight: var(--fw-medium);
	}
	.search {
		flex: 2 1 20rem;
		display: flex;
		gap: var(--gap-sm);
		max-inline-size: 30rem;
	}
	.search-field {
		flex: 1;
		min-inline-size: 0;
	}
	.search-field input {
		box-sizing: border-box;
		inline-size: 100%;
		padding: var(--gap-md) var(--gap-lg);
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-full);
		background: transparent;
		font: inherit;
		line-height: var(--leading-ui);
	}
	.top-links {
		flex: 1 1 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: end;
		align-items: center;
		gap: var(--gap-md) var(--gap-xl);
		color: var(--muted);
	}
	.outline-pill,
	.accent-pill {
		padding: var(--gap-md) var(--gap-lg);
	}
	.top-links a {
		display: inline-flex;
		align-items: center;
		gap: var(--gap-xs);
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
		gap: var(--gap-2xl);
		color: var(--muted);
		overflow-x: auto;
		scrollbar-width: none;
		white-space: nowrap;
	}
	.doc-tabs a {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		padding-block: var(--gap-md);
		border-block-end: var(--border-w-thin) solid transparent;
	}
	.doc-tabs [aria-current] {
		color: var(--ext-accent);
		border-color: var(--ext-accent);
	}

	.columns {
		display: flex;
		gap: var(--gap-3xl) var(--gap-3xl);
		padding-block: var(--gap-2xl) var(--gap-3xl);
	}
	.sidebar {
		flex: 1 0 15rem;
		max-inline-size: 18rem;
	}
	.sidebar nav {
		display: grid;
		gap: var(--gap-xs);
		border-inline-start: var(--border-w-thin) solid var(--line);
	}
	.sidebar nav a {
		display: flex;
		justify-content: space-between;
		padding: var(--gap-sm) var(--gap-lg) var(--gap-sm) var(--gap-md);
		color: var(--muted);
	}
	.sidebar h2 {
		margin-block-start: var(--gap-lg);
		padding: var(--gap-sm) var(--gap-md);
		font-size: var(--text-xs);
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
		gap: var(--gap-md);
		margin-block-start: var(--gap-md);
		padding: var(--gap-lg);
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-full);
		color: var(--muted);
	}

	.content {
		flex: 3 1 0;
		min-inline-size: 0;
		max-inline-size: 48rem;
		font-size: var(--text-md);
		line-height: var(--leading-loose);
	}
	.crumb-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--gap-lg);
	}
	.crumbs {
		color: var(--muted);
		font-size: var(--text-xs);
		line-height: var(--leading-tight);
	}
	.ask {
		display: flex;
		align-items: stretch;
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-full);
		color: var(--muted);
		font-size: var(--text-sm);
		line-height: var(--leading-ui);
	}
	.ask a {
		padding: var(--gap-sm) var(--gap-sm) var(--gap-sm) var(--gap-md);
	}
	.ask button {
		padding-inline: var(--gap-sm);
		border-inline-start: var(--border-w-thin) solid var(--line);
	}
	.content h1 {
		margin-block-start: var(--gap-sm);
		font-size: var(--text-4xl);
		line-height: var(--leading-tight);
	}
	.content .lede {
		margin-block: var(--gap-md) var(--gap-xl);
		color: var(--muted);
		font-size: var(--text-lg);
		line-height: var(--leading-tight);
	}
	.content p + p {
		margin-block-start: var(--gap-lg);
	}
	.content h2 {
		margin-block: var(--gap-3xl) var(--gap-lg);
		font-size: var(--text-2xl);
		line-height: var(--leading-tight);
	}
	.content ul {
		display: grid;
		gap: var(--gap-sm);
		margin-block-start: var(--gap-lg);
		padding-inline-start: var(--gap-xl);
	}
	code {
		padding: 0 var(--gap-xs);
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-sm);
		background: var(--hue-neutral-100);
		font-family: var(--ff-mono);
		font-size: var(--text-sm);
	}
	.table-scroll {
		margin-block-start: var(--gap-xl);
		overflow-x: auto;
	}
	table {
		inline-size: 100%;
		border-collapse: separate;
		border-spacing: 0;
		font-size: var(--text-sm);
		line-height: var(--leading-tight);
	}
	th {
		padding: var(--gap-sm) var(--gap-md);
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
		padding: var(--gap-md);
		border-block-end: var(--border-w-thin) solid var(--line);
		vertical-align: top;
	}
	td:first-child {
		border-inline-end: var(--border-w-thin) solid var(--line);
	}
	tr:last-child td {
		border-block-end: 0;
	}
	.updated {
		color: var(--muted);
		font-size: var(--text-sm);
	}

	.toc {
		flex: 1 0 12rem;
		max-inline-size: 16rem;
		line-height: var(--leading-tight);
	}
	.toc h2 {
		padding-block: var(--gap-xs) var(--gap-lg);
		color: var(--muted);
		font-size: var(--text-xs);
		font-weight: var(--fw-medium);
		text-transform: uppercase;
	}
	.toc ol {
		display: grid;
		gap: var(--gap-lg);
		margin: 0;
		padding: 0 0 var(--gap-xl);
		list-style: none;
		border-inline-start: var(--border-w-thin) solid var(--line);
		border-block-end: var(--border-w-thin) solid var(--line);
	}
	.toc a {
		display: block;
		padding-inline: var(--gap-md) var(--gap-sm);
		color: var(--muted);
	}
	.toc [aria-current] {
		margin-inline-start: calc(var(--border-w-thin) * -1);
		padding-block: var(--gap-xs);
		border-inline-start: var(--border-w-standard) solid var(--ext-accent);
		color: var(--ext-accent);
	}
	.toc p {
		margin-block-start: var(--gap-2xl);
		color: var(--muted);
	}
	.helpful {
		display: inline-flex;
		gap: var(--gap-sm);
		margin-block-start: var(--gap-md);
		padding: var(--gap-xs) var(--gap-sm);
		border: var(--border-w-thin) solid var(--line);
		border-radius: var(--radius-full);
	}
	.helpful button {
		padding: var(--gap-sm);
		border-radius: 50%;
		background: var(--hue-neutral-300);
	}

	.site-footer {
		padding-block: var(--gap-3xl);
		border-block-start: var(--border-w-thin) solid var(--line);
	}
	.footer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
		gap: var(--gap-2xl) var(--gap-3xl);
	}
	.footer-brand {
		display: inline-flex;
		align-items: center;
		align-self: start;
		gap: var(--gap-md);
		font-size: var(--text-4xl);
		font-weight: var(--fw-medium);
	}
	.site-footer nav {
		display: grid;
		gap: var(--gap-lg);
		align-content: start;
		color: var(--muted);
	}
	.site-footer h2 {
		color: var(--ext-ink);
		font-size: var(--text-sm);
	}
	.socials {
		display: flex;
		justify-content: center;
		gap: var(--gap-2xl);
		margin-block-start: var(--gap-4xl);
	}
	.socials i {
		padding: var(--gap-md);
		border-radius: var(--radius-sm);
		background: var(--muted);
	}

	/* The two structural changes: side columns can't become menus by wrapping. */
	@media (max-width: 70rem) {
		.toc {
			display: none;
		}
	}
	@media (max-width: 48rem) {
		.sidebar {
			display: none;
		}
	}
</style>
