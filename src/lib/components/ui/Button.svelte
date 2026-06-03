<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import type { ComponentProps, Snippet } from 'svelte';

	type Props = Omit<ComponentProps<typeof ButtonPrimitive.Root>, 'children'> & {
		children: Snippet;
	};

	let { children, ...rest }: Props = $props();
</script>

<ButtonPrimitive.Root {...rest}>
	{@render children()}
</ButtonPrimitive.Root>
