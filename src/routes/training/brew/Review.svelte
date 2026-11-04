<script lang="ts" module>
	import type { Brew } from './engine/brews';
	export type ReviewInput = Pick<
		Brew,
		'bagId' | 'grinder' | 'grindSetting' | 'dialedIn' | 'review'
	>;
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { Switch } from 'bits-ui';
	import {
		DESCRIBED_ATTRIBUTES,
		RATED_ATTRIBUTES,
		cvaScore,
		scoreBand,
		topNotes,
		type Description,
		type DescribedAttribute,
		type RatedAttribute
	} from './engine/cva';
	import { listBags, saveBag, type Bag } from './engine/brews';
	import BagSelect from './BagSelect.svelte';
	import Field from './Field.svelte';
	import Pill from './Pill.svelte';
	import ReviewBand from './ReviewBand.svelte';
	import ScoreSlider from './ScoreSlider.svelte';

	type Props = {
		onSave: (input: ReviewInput) => void;
		initialBagId: string | null;
		initialGrindSetting: string;
	};
	const { onSave, initialBagId, initialGrindSetting }: Props = $props();

	const NEW_BAG = 'new';
	const NO_BAG = 'none';
	const BAG_FIELDS = ['roaster', 'producer', 'region', 'altitude', 'variety', 'process'] as const;

	let bags = $state<Bag[]>([]);
	listBags().then((b) => (bags = b));

	let bagChoice = $state(untrack(() => initialBagId) ?? NO_BAG);
	const newBag = $state<Omit<Bag, 'id'>>({
		roaster: '',
		producer: '',
		region: '',
		altitude: '',
		variety: '',
		process: '',
		roastDate: ''
	});
	let grinder = $state(localStorage.getItem('grinder') ?? '');
	let grindSetting = $state(untrack(() => initialGrindSetting));
	let dialedIn = $state(false);

	const descriptions = $state(
		Object.fromEntries(DESCRIBED_ATTRIBUTES.map((k) => [k, { intensity: 8, notes: '' }])) as Record<
			DescribedAttribute,
			{ intensity: number; notes: string }
		>
	);
	const ratings = $state(
		Object.fromEntries(RATED_ATTRIBUTES.map((k) => [k, 5])) as Record<RatedAttribute, number>
	);

	const parsedDescriptions = $derived(
		Object.fromEntries(
			DESCRIBED_ATTRIBUTES.map((k) => [
				k,
				{
					intensity: descriptions[k].intensity,
					notes: descriptions[k].notes
						.split(',')
						.map((n) => n.trim())
						.filter(Boolean)
				}
			])
		) as Record<DescribedAttribute, Description>
	);
	const score = $derived(cvaScore(ratings));
	const notes = $derived(topNotes(parsedDescriptions));

	const bagItems = $derived([
		{ value: NO_BAG, label: 'No bag' },
		...bags.map((b) => ({ value: b.id, label: `${b.roaster} · ${b.producer || b.region}` })),
		{ value: NEW_BAG, label: 'Add a new bag…' }
	]);

	async function save() {
		let bagId: string | null = bagChoice === NO_BAG ? null : bagChoice;
		if (bagChoice === NEW_BAG) {
			bagId = crypto.randomUUID();
			await saveBag({ id: bagId, ...newBag });
		}
		localStorage.setItem('grinder', grinder);
		onSave({
			bagId,
			grinder,
			grindSetting,
			dialedIn,
			review: { descriptions: parsedDescriptions, ratings: { ...ratings }, score }
		});
	}
</script>

<ReviewBand heading="Review">
	<p class="score"><span class="number">{score.toFixed(2)}</span></p>
	<p class="band">
		{scoreBand(score)}{#if notes.length}<span class="notes"> · {notes.join(', ')}</span>{/if}
	</p>
</ReviewBand>

<ReviewBand heading="Beans">
	<BagSelect label="Beans" bind:value={bagChoice} items={bagItems} />
	{#if bagChoice === NEW_BAG}
		{#each BAG_FIELDS as field (field)}
			<Field label={field}><input bind:value={newBag[field]} /></Field>
		{/each}
		<Field label="Roast date"><input type="date" bind:value={newBag.roastDate} /></Field>
	{/if}
</ReviewBand>

<ReviewBand heading="Grind">
	<Field label="Grinder"><input bind:value={grinder} /></Field>
	<Field label="Setting"><input bind:value={grindSetting} /></Field>
	<label class="toggle">
		Dialed in correctly
		<Switch.Root bind:checked={dialedIn}>
			{#snippet child({ props })}
				<button {...props} class="switch u:radius-full">
					<Switch.Thumb>
						{#snippet child({ props: thumbProps })}
							<span {...thumbProps} class="knob u:radius-full"></span>
						{/snippet}
					</Switch.Thumb>
				</button>
			{/snippet}
		</Switch.Root>
	</label>
</ReviewBand>

<ReviewBand heading="Describe">
	<div class="rows">
		{#each DESCRIBED_ATTRIBUTES as key (key)}
			<div>
				<ScoreSlider
					label="{key} · intensity"
					valueLabel="{key} intensity"
					bind:value={descriptions[key].intensity}
					min={0}
					max={15}
				/>
				<Field label="Notes"
					><input placeholder="comma separated" bind:value={descriptions[key].notes} /></Field
				>
			</div>
		{/each}
	</div>
</ReviewBand>

<ReviewBand heading="Rate">
	<div class="rows">
		{#each RATED_ATTRIBUTES as key (key)}
			<ScoreSlider
				label={key}
				valueLabel="{key} rating"
				bind:value={ratings[key]}
				min={1}
				max={9}
			/>
		{/each}
	</div>
</ReviewBand>

<ReviewBand heading="">
	<Pill variant="solid" onclick={save}>Save brew</Pill>
</ReviewBand>

<style>
	.score {
		margin: 0;
		container-type: inline-size;
	}
	.number {
		/* Display element: the review's hero, sized to its column and capped to the screen. */
		font-size: min(30cqi, 40dvh);
		line-height: 1;
		font-weight: 200;
		font-variant-numeric: tabular-nums;
		color: var(--hue-white);
	}
	.band {
		margin: var(--gap-md) 0 0;
		font-size: var(--text-xl);
		line-height: var(--leading-tight);
		color: var(--brew-accent);
	}
	.notes {
		color: var(--hue-z0-fg);
	}
	.rows {
		display: grid;
		gap: var(--gap-2xl);
	}
	.toggle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-block-size: var(--gap-4xl);
		font-size: var(--text-md);
		line-height: var(--leading-ui);
		color: var(--hue-z0-muted);
	}
	.switch {
		display: flex;
		inline-size: var(--gap-4xl);
		padding: var(--gap-xs);
		background: var(--hue-z2-bg);
		border: 0;
		cursor: pointer;
	}
	.switch[data-state='checked'] {
		justify-content: flex-end;
		background: var(--brew-accent);
	}
	.knob {
		display: block;
		inline-size: var(--gap-xl);
		block-size: var(--gap-xl);
		background: var(--hue-white);
	}
</style>
