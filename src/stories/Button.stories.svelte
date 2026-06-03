<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from '$lib/components/ui/Button.svelte';
	import { fn } from 'storybook/test';

	const { Story } = defineMeta({
		title: 'UI/Button',
		component: Button,
		tags: ['autodocs'],
		args: {
			onclick: fn()
		}
	});
</script>

<Story name="Primary">
	<Button>Click me</Button>
</Story>

<Story name="Disabled">
	<Button disabled>Disabled</Button>
</Story>
