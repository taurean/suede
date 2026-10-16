<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DynamicLabel from '#lib/components/ui/DynamicLabel.svelte';
	import SuedeButton from '#lib/components/ui/SuedeButton.svelte';

	const { Story } = defineMeta({
		title: 'UI/DynamicLabel',
		component: DynamicLabel,
		tags: ['autodocs'],
		args: {
			text: 'New chat',
			announce: false
		},
		argTypes: {
			text: { control: 'text' },
			announce: { control: 'boolean' }
		}
	});
</script>

<script lang="ts">
	const labels = ['New chat', 'Suede design system principles'];
	let labelIndex = $state(0);

	function swapLabel() {
		labelIndex = (labelIndex + 1) % labels.length;
	}
</script>

<Story name="Default" />

<Story name="Swap" asChild>
	<p class="u:fs-3">
		<DynamicLabel text={labels[labelIndex]} />
	</p>
	<SuedeButton onclick={swapLabel}>Swap label</SuedeButton>
</Story>

<Story name="Swap, announced" asChild>
	<p class="u:fs-3">
		<DynamicLabel text={labels[labelIndex]} announce />
	</p>
	<SuedeButton onclick={swapLabel}>Swap label</SuedeButton>
</Story>

<Story name="Slow, large type" asChild>
	<p class="u:fs-8">
		<DynamicLabel text={labels[labelIndex]} style="--dynamic-label-speed: 0.25" />
	</p>
	<SuedeButton onclick={swapLabel}>Swap label</SuedeButton>
</Story>
