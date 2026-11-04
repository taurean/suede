<!-- Training prototype. A hand redraw of the Drydown mark from the brand guide, standing in for the real asset. Without `ring` it draws all three. -->
<script lang="ts">
	type Ring = 'first' | 'middle' | 'final';

	let { ring, label }: { ring?: Ring; label?: string } = $props();

	const rings: Record<Ring, { radius: number; offset: number; path: string }> = {
		first: { radius: 20, offset: 18, path: 'M0 -2.4a2.4 2.4 0 1 0 0 4.8a2.4 2.4 0 1 0 0 -4.8z' },
		middle: {
			radius: 33,
			offset: 0,
			path: 'M0 4 C-0.8 1.8 -3.2 0.4 -3.2 -1.6 A3.2 3.2 0 0 1 3.2 -1.6 C3.2 0.4 0.8 1.8 0 4 Z'
		},
		final: {
			radius: 46,
			offset: 18,
			path: 'M0 -4.5 Q1.4 -1.4 3.6 0 Q1.4 1.4 0 4.5 Q-1.4 1.4 -3.6 0 Q-1.4 -1.4 0 -4.5 Z'
		}
	};
	const shown = $derived(ring ? [rings[ring]] : Object.values(rings));
</script>

<svg
	class="mark"
	viewBox="-52 -52 104 104"
	fill="currentColor"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : true}
>
	{#each shown as { radius, offset, path } (radius)}
		{#each { length: 10 }, i (i)}
			<path d={path} transform={`rotate(${offset + i * 36}) translate(0 ${-radius})`} />
		{/each}
	{/each}
</svg>

<style>
	.mark {
		display: block;
		inline-size: 100%;
		flex: none;
	}
</style>
