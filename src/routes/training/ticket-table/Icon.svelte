<!-- Training prototype. suede ships no icon set, and adding one is a dependency decision. -->
<script lang="ts">
	const paths = {
		panel: ['M3 5h18v14H3z', 'M9 5v14', 'M5 8.5h2', 'M5 11.5h2'],
		'chevron-down': ['m7 10 5 5 5-5'],
		'chevron-up': ['m7 14 5-5 5 5'],
		'chevron-left': ['m15 5-7 7 7 7'],
		'chevron-right': ['m9 5 7 7-7 7'],
		updown: ['m8 9 4-4 4 4', 'm8 15 4 4 4-4'],
		download: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'M12 7v9', 'm8 12 4 4 4-4'],
		share: ['M12 15V3', 'm8 7 4-4 4 4', 'M8 11H5v10h14V11h-3'],
		plus: ['M12 4v16', 'M4 12h16'],
		collapse: ['M20 4v16', 'M16 12H4', 'm9 7-5 5 5 5'],
		first: ['M5 5v14', 'M20 12H9', 'm14 7-5 5 5 5'],
		last: ['M19 5v14', 'M4 12h11', 'm10 7 5 5-5 5'],
		search: ['M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0', 'm16 16 5 5'],
		inbox: ['M6 5h12l4 8v6H2v-6z', 'M2 13h6l2 3h4l2-3h6'],
		chart: ['M3 3v18h18', 'm7 15 4-5 3 3 6-7'],
		library: ['M5 4v16', 'M9 4v16', 'M13 4v16', 'm16 4 5 16'],
		requests: ['M4 5h4v4H4z', 'M12 7h9', 'm4 16 2 2 3-4', 'M12 16h9'],
		users: [
			'M15 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
			'M3 21c0-4 3-6 8-6s8 2 8 6',
			'M17 4c2 1 3 2.5 3 4s-1 3-3 4',
			'M20 15c1.500 1 2 3 2 6'
		],
		lifebuoy: [
			'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
			'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
			'm6 6 3 3',
			'm15 15 3 3',
			'm18 6-3 3',
			'm9 15-3 3'
		],
		message: ['M3 4h18v14H8l-5 3z', 'M8 9h8', 'M8 13h5'],
		invite: [
			'M14 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
			'M3 21c0-4 3-6 7-6 1.500 0 3 .3 4 1',
			'M18 15v6',
			'M15 18h6'
		],
		filter: ['M3 7h18', 'M6 12h12', 'M10 17h4'],
		sliders: [
			'M3 7h9',
			'M16 7h5',
			'M12 4v6',
			'M3 17h5',
			'M12 17h9',
			'M8 14v6',
			'M16 12h5',
			'M3 12h9'
		],
		person: [
			'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
			'M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
			'M6.500 19c1-3 3-4 5.500-4s4.500 1 5.500 4'
		],
		trash: ['M4 6h16', 'M9 6V3h6v3', 'M6 6v15h12V6', 'M10 11v6', 'M14 11v6'],
		check: ['m5 12.500 4.500 4.500L19 7']
	};

	let {
		name,
		label,
		size,
		weight
	}: { name: keyof typeof paths; label?: string; size?: 'small'; weight?: 'bold' } = $props();
</script>

<svg
	class="icon"
	data-size={size}
	data-weight={weight}
	viewBox="0 0 24 24"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : true}
>
	{#each paths[name] as d (d)}
		<path {d} />
	{/each}
</svg>

<style>
	.icon {
		inline-size: var(--ext-size-icon);
		block-size: var(--ext-size-icon);
		flex: none;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.icon[data-size='small'] {
		inline-size: 0.75rem;
		block-size: 0.75rem;
	}
	.icon[data-weight='bold'] {
		stroke-width: 3;
	}
</style>
