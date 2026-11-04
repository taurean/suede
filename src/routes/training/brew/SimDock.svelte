<script lang="ts">
	import Pill from './Pill.svelte';
	import type { SimAction } from './sim-scale';

	type Props = {
		active: boolean;
		actions: SimAction[];
		busy: boolean;
		speed: number;
		onStart: () => void;
		onAction: (action: SimAction) => void;
		onSpeed: () => void;
		onOff: () => void;
	};
	const { active, actions, busy, speed, onStart, onAction, onSpeed, onOff }: Props = $props();
</script>

<!-- Not part of the design: the hands at the scale, so the flow can be walked without hardware. -->
<aside class="dock" aria-label="Prototype scale controls">
	<span class="tag">Prototype scale</span>
	{#if active}
		{#each actions as action (action.label)}
			<Pill disabled={busy} onclick={() => onAction(action)}>{action.label}</Pill>
		{/each}
		<Pill onclick={onSpeed}>{speed}× speed</Pill>
		<Pill onclick={onOff}>Turn scale off</Pill>
	{:else}
		<Pill onclick={onStart}>Simulate scale</Pill>
	{/if}
</aside>

<style>
	.dock {
		position: sticky;
		inset-block-end: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gap-sm);
		padding: var(--gap-sm) var(--brew-edge);
		background: var(--hue-z1-bg);
		border-block-start: var(--border-w-thin) solid var(--hue-z1-border);
	}
	.tag {
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		line-height: var(--leading-ui);
		text-transform: uppercase;
		color: var(--hue-z1-muted);
	}
</style>
