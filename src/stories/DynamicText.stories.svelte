<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DynamicText from '#lib/components/ui/DynamicText.svelte';
	import SuedeButton from '#lib/components/ui/SuedeButton.svelte';

	const { Story } = defineMeta({
		title: 'UI/DynamicText',
		component: DynamicText,
		tags: ['autodocs'],
		args: {
			text: 'New chat',
			announce: true
		},
		argTypes: {
			text: { control: 'text' },
			announce: { control: 'boolean' }
		}
	});
</script>

<script lang="ts">
	const samples = ['New chat', 'Suede design system principles'];
	let sampleIndex = $state(0);

	function swapText() {
		sampleIndex = (sampleIndex + 1) % samples.length;
	}
</script>

<Story name="Default" />

<Story name="Swap" asChild>
	<p class="u:fs-3">
		<DynamicText text={samples[sampleIndex]} />
	</p>
	<SuedeButton onclick={swapText}>Swap text</SuedeButton>
</Story>

<Story name="Swap, not announced" asChild>
	<p class="u:fs-3">
		<DynamicText text={samples[sampleIndex]} announce={false} />
	</p>
	<SuedeButton onclick={swapText}>Swap text</SuedeButton>
</Story>

<Story name="Large type" asChild>
	<p class="u:fs-8">
		<DynamicText text={samples[sampleIndex]} />
	</p>
	<SuedeButton onclick={swapText}>Swap text</SuedeButton>
</Story>
