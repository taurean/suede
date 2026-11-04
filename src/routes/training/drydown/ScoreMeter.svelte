<!-- Training prototype: a score out of 10 drawn as the logo's teardrop ring, lit clockwise from 12 o'clock. Deleted when training graduates. -->
<script lang="ts">
	import { teardropPath } from './Starburst.svelte';

	let { score, rays, label }: { score: number; rays: number; label: string } = $props();

	const lit = $derived(Math.round((score / 10) * rays));
	const drop = $derived(teardropPath(68, 98, (68 * Math.PI) / rays - 0.6));
</script>

<svg viewBox="-100 -100 200 200" role="img" aria-label={label}>
	{#each { length: rays }, i (i)}
		<path d={drop} transform="rotate({(i * 360) / rays})" data-lit={i < lit} />
	{/each}
</svg>

<style>
	path {
		fill: var(--hue-z0-border);
	}

	path[data-lit='true'] {
		fill: var(--drydown-accent);
	}
</style>
