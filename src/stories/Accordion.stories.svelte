<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Accordion from '$lib/components/ui/Accordion.svelte';

	const { Story } = defineMeta({
		title: 'UI/Accordion',
		component: Accordion,
		tags: ['autodocs']
	});
</script>

{#snippet sectionOne()}
	<p>Content for section 1.</p>
{/snippet}

{#snippet sectionTwo()}
	<p>Content for section 2.</p>
{/snippet}

<Story name="Single">
	<Accordion
		items={[
			{ value: 'item-1', title: 'Section 1', content: sectionOne },
			{ value: 'item-2', title: 'Section 2', content: sectionTwo }
		]}
		type="single"
	/>
</Story>

<Story name="Multiple">
	<Accordion
		items={[
			{ value: 'item-1', title: 'Section 1', content: sectionOne },
			{ value: 'item-2', title: 'Section 2', content: sectionTwo }
		]}
		type="multiple"
	/>
</Story>
