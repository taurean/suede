<!-- Training prototype. -->
<script lang="ts">
	const networks = [
		'Network one',
		'Network two',
		'Network three',
		'Network four',
		'Network five',
		'Network six'
	];
</script>

<aside class="side l:waterfall">
	<nav class="block" aria-label="Site">
		<a href="#top">About</a>
		<a href="#top">Contact</a>
		<span class="uc-heading" aria-hidden="true"><em>fnb</em></span>
	</nav>
	<p class="block">
		A design office making its own projects, events and publications, while taking on a few clients.
		Run by two sample people in a sample town.
	</p>
	<div class="block">
		<p>Follow @fieldnote</p>
		<ul class="socials">
			{#each networks as network (network)}
				<li><a href={`#${network}`} aria-label={network}></a></li>
			{/each}
		</ul>
	</div>
	<div class="block">
		<h2 class="uc-heading">Contact</h2>
		<p><strong>Post</strong><br />100 Example Street<br />Sample City 00000</p>
		<p><strong>Phone</strong><br />(555) 010-0100</p>
		<p><strong>Email</strong><br />hello @ fieldnote.test</p>
	</div>
	<div class="block" data-tone="quiet">
		<h2 class="uc-heading">Colophon</h2>
		<p><strong>Wordmark</strong><br />System type, stretched as a stand-in.</p>
		<p><strong>Body</strong><br />The default sans stack.</p>
	</div>
</aside>

<style>
	.side {
		padding: var(--gap-4xl) var(--gap-2xl);
		color: var(--hue-signal);
	}
	.block {
		--waterfall-gap: var(--gap-3xl);
		display: grid;
		gap: calc(var(--line) / 2);
		padding-block-end: var(--line);
		border-block-end: var(--border-w-thin) solid currentColor;
	}
	.block[data-tone='quiet'] {
		border: 0;
		color: var(--hue-z1-muted);
	}
	a {
		text-decoration: none;
	}
	.socials {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-lg);
	}
	.socials a {
		display: block;
		padding: var(--gap-sm);
		border-radius: var(--radius-full);
		background: currentColor;
	}
</style>
