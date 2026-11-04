<!-- Training prototype: Drydown's logo mark, or any subset of its rings. Each ring keeps its place in the full mark, so a ring drawn alone sits at its true radius. Deleted when training graduates. -->
<script module lang="ts">
	const turns = (count: number) => Array.from({ length: count }, (_, i) => (i * 360) / count);

	/** A teardrop on the 12 o'clock axis: round end at `inner`, point at `outer`. */
	export function teardropPath(inner: number, outer: number, halfWidth: number) {
		const shoulder = inner + halfWidth;
		const pull = inner + (outer - inner) * 0.55;
		return (
			`M0 ${-outer} C${halfWidth * 0.2} ${-pull} ${halfWidth} ${-shoulder - halfWidth} ${halfWidth} ${-shoulder} ` +
			`A${halfWidth} ${halfWidth} 0 1 1 ${-halfWidth} ${-shoulder} ` +
			`C${-halfWidth} ${-shoulder - halfWidth} ${-halfWidth * 0.2} ${-pull} 0 ${-outer} Z`
		);
	}

	const drop = teardropPath(38, 66, 6);
</script>

<script lang="ts">
	type Ring = 'dots' | 'teardrops' | 'diamonds';

	let { rings = ['dots', 'teardrops', 'diamonds'] }: { rings?: Ring[] } = $props();
</script>

<svg viewBox="-100 -100 200 200" fill="currentColor" aria-hidden="true">
	{#if rings.includes('dots')}
		{#each turns(12) as angle (angle)}
			<circle cy="-25" r="4" transform="rotate({angle})" />
		{/each}
	{/if}
	{#if rings.includes('teardrops')}
		{#each turns(18) as angle (angle)}
			<path d={drop} transform="rotate({angle})" />
		{/each}
	{/if}
	{#if rings.includes('diamonds')}
		{#each turns(24) as angle (angle)}
			<path d="M0 -98 L5 -85 L0 -72 L-5 -85 Z" transform="rotate({angle})" />
		{/each}
	{/if}
</svg>
