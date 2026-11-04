<script lang="ts" module>
	import type { MethodId, Setup } from './engine/methods';
	export type StartChoice = Setup & {
		method: MethodId;
		bagId: string | null;
		grindSetting: string;
	};
</script>

<script lang="ts">
	import { RadioGroup } from 'bits-ui';
	import { latestDialedIn, listBagBrews, listBags, type Bag } from './engine/brews';
	import { METHODS } from './engine/methods';
	import {
		POUR_OVER_DEFAULT_DOSE_G,
		POUR_OVER_DEFAULT_TEMP_C,
		POUR_OVER_MAX_DOSE_G,
		POUR_OVER_MIN_DOSE_G
	} from './engine/pourover';
	import BagSelect from './BagSelect.svelte';
	import Field from './Field.svelte';
	import Pill from './Pill.svelte';

	const { onStart }: { onStart: (choice: StartChoice) => void } = $props();

	const NO_BAG = 'none';
	const BASKET_KEY = 'basketGrams';

	let bags = $state<Bag[]>([]);
	listBags().then((b) => (bags = b));

	let method = $state<MethodId>('espresso');
	let bagChoice = $state(NO_BAG);
	let basket = $state(Number(localStorage.getItem(BASKET_KEY)) || 18);
	let pourDose = $state(POUR_OVER_DEFAULT_DOSE_G);
	let waterTemp = $state(POUR_OVER_DEFAULT_TEMP_C);
	let grindSetting = $state('');

	const bagItems = $derived([
		{ value: NO_BAG, label: 'No bag' },
		...bags.map((b) => ({ value: b.id, label: `${b.roaster} · ${b.producer || b.region}` }))
	]);
	const doseInRange = $derived(
		pourDose >= POUR_OVER_MIN_DOSE_G && pourDose <= POUR_OVER_MAX_DOSE_G
	);
	const canStart = $derived(method === 'espresso' ? basket > 0 : doseInRange);

	// Prefill from the latest dialed-in brew of this bag and method, else method defaults.
	$effect(() => {
		const forMethod = method;
		const bagId = bagChoice;
		let stale = false;
		const brews = bagId === NO_BAG ? Promise.resolve([]) : listBagBrews(bagId);
		brews.then((found) => {
			if (stale) return;
			const best = latestDialedIn(found, forMethod);
			grindSetting = best?.grindSetting ?? '';
			waterTemp = best?.method === 'pourover' ? best.waterTemp : POUR_OVER_DEFAULT_TEMP_C;
		});
		return () => {
			stale = true;
		};
	});

	function start() {
		if (method === 'espresso') localStorage.setItem(BASKET_KEY, String(basket));
		onStart({
			method,
			dose: method === 'espresso' ? basket : pourDose,
			waterTemp,
			bagId: bagChoice === NO_BAG ? null : bagChoice,
			grindSetting
		});
	}
</script>

<div class="stack">
	<h1 class="title">Start a brew</h1>

	<RadioGroup.Root
		value={method}
		onValueChange={(v) => (method = v as MethodId)}
		aria-label="Method"
	>
		{#snippet child({ props })}
			<div {...props} class="methods">
				{#each Object.entries(METHODS) as [id, m] (id)}
					<RadioGroup.Item value={id}>
						{#snippet child({ props: itemProps })}
							<button {...itemProps} class="method">{m.label}</button>
						{/snippet}
					</RadioGroup.Item>
				{/each}
			</div>
		{/snippet}
	</RadioGroup.Root>

	<div>
		<BagSelect label="Beans (optional)" bind:value={bagChoice} items={bagItems} />
		{#if method === 'espresso'}
			<Field label="Basket size (g)"
				><input type="number" step="0.5" min="1" bind:value={basket} /></Field
			>
		{:else}
			<Field label="Dose ({POUR_OVER_MIN_DOSE_G} to {POUR_OVER_MAX_DOSE_G}g)">
				<input
					type="number"
					step="0.5"
					min={POUR_OVER_MIN_DOSE_G}
					max={POUR_OVER_MAX_DOSE_G}
					bind:value={pourDose}
				/>
			</Field>
			<Field label="Water temperature (°C)"
				><input type="number" step="1" bind:value={waterTemp} /></Field
			>
		{/if}
		<Field label="Grind setting"><input bind:value={grindSetting} /></Field>
	</div>

	<p class="ratio">Target ratio is 1:{METHODS[method].ratio}.</p>
	<div><Pill variant="solid" onclick={start} disabled={!canStart}>Start</Pill></div>
</div>

<style>
	.stack {
		display: grid;
		gap: var(--gap-3xl);
	}
	.title {
		margin: 0;
		font-family: var(--ff-sans);
		font-size: var(--text-6xl);
		line-height: var(--leading-tight);
		font-weight: 200;
		color: var(--hue-white);
	}
	.methods {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-xl) var(--gap-3xl);
	}
	.method {
		padding: 0 0 var(--gap-sm);
		font-family: var(--ff-sans);
		font-size: var(--text-4xl);
		line-height: var(--leading-tight);
		font-weight: 300;
		background: transparent;
		border: 0;
		border-block-end: var(--border-w-standard) solid transparent;
		color: var(--hue-z0-muted);
		cursor: pointer;
	}
	.method[data-state='checked'] {
		color: var(--brew-accent);
		border-block-end-color: var(--brew-accent);
	}
	.ratio {
		margin: 0;
		font-family: var(--ff-mono);
		font-size: var(--text-xs);
		line-height: var(--leading-ui);
		text-transform: uppercase;
		color: var(--hue-z0-muted);
	}
</style>
