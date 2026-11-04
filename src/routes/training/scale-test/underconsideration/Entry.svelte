<!-- Training prototype. One titled item in a directory column. -->
<script lang="ts">
	export type EntryData = {
		title: string;
		body: string;
		link?: string;
		meta?: string[];
		thumb?: 'tall' | 'grid';
	};

	let { title, body, link, meta, thumb }: EntryData = $props();
</script>

<div>
	<h3>{title}</h3>
	<p>{body}</p>
	{#if link}<a href="#top">{link}</a>{/if}
	{#if meta}
		<ul class="meta">
			{#each meta as line (line)}<li>{line}</li>{/each}
		</ul>
	{/if}
	{#if thumb}<div class="thumb" data-kind={thumb} aria-hidden="true"></div>{/if}
</div>

<style>
	.meta {
		color: var(--hue-z1-muted);
		font-size: var(--text-xs);
		font-weight: var(--fw-bold);
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}
	/* Placeholders hold the real image's space and stay quiet, since real images carry the colour. */
	.thumb {
		inline-size: 50%;
		max-inline-size: 8rem;
		margin-block-start: calc(var(--line) / 2);
		background: var(--hue-slate-900);
	}
	.thumb[data-kind='tall'] {
		aspect-ratio: 128 / 166;
	}
	.thumb[data-kind='grid'] {
		aspect-ratio: 1;
	}
</style>
