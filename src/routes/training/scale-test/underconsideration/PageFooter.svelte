<!-- Training prototype. -->
<script lang="ts">
	const networks = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
	const follow = [
		['@fieldnote', [1, 0, 1, 1, 1, 1]],
		['@samsample', [1, 1, 1, 0, 1, 0]],
		['@alexsample', [1, 1, 1, 0, 0, 0]]
	] as const;
	const links = [
		'About',
		'Blogs we publish',
		'Events we organize',
		'Products we sell',
		'Things we’ve made',
		'Projects we’ve concluded',
		'Mailing list',
		'News',
		'Contact'
	];
</script>

<footer class="footer" id="footer" data-theme="light">
	<div class="block">
		<h2>Fieldnote Bureau</h2>
		<a href="#top">hello@fieldnote.test</a>
	</div>
	<nav class="block" aria-label="Footer">
		<h2>Pages</h2>
		{#each links as link (link)}<a href="#top">{link}</a>{/each}
	</nav>
	<div class="follow">
		<table>
			<thead>
				<tr>
					<th scope="col">Follow</th>
					{#each networks as network (network)}<th scope="col">{network}</th>{/each}
				</tr>
			</thead>
			<tbody>
				{#each follow as [handle, marks] (handle)}
					<tr>
						<td>{handle}</td>
						{#each marks as mark, i (i)}<td>{mark ? '•' : ''}</td>{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</footer>

<style>
	.footer {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-2xl);
		padding: var(--gap-2xl) var(--gap-2xl) var(--gap-4xl) var(--gap-4xl);
		background: var(--hue-white);
		color: var(--hue-neutral-950);
	}
	a {
		text-decoration: none;
	}
	.block {
		flex: 1 1 12rem;
		display: grid;
		align-content: start;
	}
	h2 {
		font-weight: var(--fw-bold);
		border-block-end: var(--border-w-thin) solid currentColor;
	}
	.follow {
		flex: 2 1 20rem;
		min-inline-size: 0;
		overflow-x: auto;
	}
	table {
		inline-size: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		border-block-end: var(--border-w-thin) solid currentColor;
		text-align: start;
	}
	th {
		font-weight: var(--fw-bold);
	}
</style>
