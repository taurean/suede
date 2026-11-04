import { doseAndGrindSteps } from './dose-and-grind';
import type { Step, StepResult } from './steps';

export const POUR_OVER_RATIO = 16;
export const POUR_OVER_MIN_DOSE_G = 12;
export const POUR_OVER_MAX_DOSE_G = 20;
export const POUR_OVER_DEFAULT_DOSE_G = 15;
export const POUR_OVER_DEFAULT_TEMP_C = 89;
// A pour this close to its target counts as reached, so a slightly short pour can't stall the flow.
export const POUR_TOLERANCE_G = 2;
// Grounds count as in the brewer once this close to the chosen dose, so a pause mid-transfer isn't recorded.
export const GROUNDS_WITHIN_G = 1;

function pour(number: number, times: number, targetSeconds: number, holdToWindow: boolean): Step {
	return {
		id: `pour-${number}`,
		kind: 'fillTimed',
		endsOn: 'target',
		stage: `Pour ${number} of 4`,
		prompt: 'Pour',
		baselineFrom: 'grounds',
		target: { timesActualOf: 'grounds', times },
		tolerance: POUR_TOLERANCE_G,
		targetSeconds,
		holdToWindow
	};
}

export function pourOverSteps(dose: number, waterTemp: number): Step[] {
	return [
		...doseAndGrindSteps(dose),
		{
			id: 'prep',
			kind: 'offScale',
			stage: 'Prep',
			prompt: `Heat water to ${waterTemp}°C, rinse the filter, preheat the vessel, then place the vessel`
		},
		{ id: 'vessel', kind: 'place', stage: 'Place vessel', prompt: 'Place the empty vessel' },
		{
			id: 'brewer',
			kind: 'place',
			on: 'vessel',
			stage: 'Place brewer',
			prompt: 'Set the brewer on the vessel'
		},
		{
			id: 'grounds',
			kind: 'place',
			on: 'brewer',
			minRise: dose - GROUNDS_WITHIN_G,
			stage: 'Grounds in',
			prompt: 'Add the grounds'
		},
		pour(1, 4, 45, true),
		pour(2, 8, 90, true),
		pour(3, 12, 135, true),
		pour(4, 16, 180, false),
		{
			id: 'drawdown',
			kind: 'remove',
			yieldOver: 'vessel',
			stage: 'Drawdown',
			prompt: 'Let it draw down, then lift the brewer off'
		}
	];
}

export type PourOverFields = {
	method: 'pourover';
	grindOutput: number | null;
	actualDose: number | null;
	waterTemp: number;
	vesselWeight: number | null;
	brewerWeight: number | null;
	pours: { target: number | null; actual: number | null; reachedSeconds: number | null }[];
	totalBrewSeconds: number | null;
	/** Seconds on the brew timer when the brewer came off; draining isn't visible on the scale. */
	drawdownEndSeconds: number | null;
	yield: number | null;
};

export function pourOverRecord(results: StepResult[], waterTemp: number): PourOverFields {
	const result = (id: string) => results.find((r) => r.id === id);
	const grounds = result('grounds');
	const drawdown = result('drawdown');
	// The last pour advances as soon as it's reached, so its final amount comes from the drawdown peak.
	const totalWater =
		drawdown?.peak !== undefined && grounds?.baseline !== undefined
			? Math.round((drawdown.peak - grounds.baseline) * 10) / 10
			: null;
	return {
		method: 'pourover',
		grindOutput: result('grind-check')?.actual ?? null,
		actualDose: grounds?.actual ?? null,
		waterTemp,
		vesselWeight: result('vessel')?.baseline ?? null,
		brewerWeight: result('brewer')?.actual ?? null,
		pours: [1, 2, 3, 4].map((n) => {
			const r = result(`pour-${n}`);
			return {
				target: r?.target ?? null,
				actual: n === 4 ? totalWater : (r?.actual ?? null),
				reachedSeconds: r?.seconds ?? null
			};
		}),
		totalBrewSeconds: drawdown?.seconds ?? null,
		drawdownEndSeconds: drawdown?.seconds ?? null,
		yield: drawdown?.actual ?? null
	};
}
