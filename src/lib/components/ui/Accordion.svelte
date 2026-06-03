<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Item {
		value: string;
		title: string;
		content: Snippet;
	}

	interface Props {
		items: Item[];
		type?: 'single' | 'multiple';
		value?: string | string[];
		onValueChange?: (value: string | string[]) => void;
	}

	let { items, type = 'single', value, onValueChange, ...rest }: Props = $props();
</script>

<AccordionPrimitive.Root
	type={type as 'single' | 'multiple'}
	value={value as never}
	onValueChange={onValueChange as never}
	{...rest}
>
	{#each items as item (item.value)}
		<AccordionPrimitive.Item value={item.value}>
			<AccordionPrimitive.Header>
				<AccordionPrimitive.Trigger>{item.title}</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>
			<AccordionPrimitive.Content>
				{@render item.content()}
			</AccordionPrimitive.Content>
		</AccordionPrimitive.Item>
	{/each}
</AccordionPrimitive.Root>
