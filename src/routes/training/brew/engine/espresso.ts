import { doseAndGrindSteps } from './dose-and-grind';
import type { Step, StepResult } from './steps';

export const ESPRESSO_RATIO = 2;
// Not in the spec yet: a common espresso target. Shown, never enforced.
export const SHOT_TARGET_SECONDS = 28;

/** The latte flow for a basket of `dose` grams. */
export function espressoSteps(dose: number): Step[] {
	return [
		...doseAndGrindSteps(dose),
		{
			id: 'prep',
			kind: 'offScale',
			stage: 'Prep puck',
			prompt: 'Distribute and tamp, then place the cup'
		},
		{ id: 'shot-cup', kind: 'place', stage: 'Shot', prompt: 'Place the empty cup' },
		{
			id: 'shot',
			kind: 'fillTimed',
			endsOn: 'removal',
			stage: 'Shot',
			prompt: 'Pull the shot',
			baselineFrom: 'shot-cup',
			target: dose * ESPRESSO_RATIO,
			targetSeconds: SHOT_TARGET_SECONDS
		},
		{
			id: 'milk',
			kind: 'offScale',
			stage: 'Milk',
			prompt: 'Steam and pour, then set the latte back on'
		}
	];
}

export type EspressoFields = {
	method: 'espresso';
	grindOutput: number | null;
	shotSeconds: number | null;
};

export function espressoRecord(results: StepResult[]): EspressoFields {
	const result = (id: string) => results.find((r) => r.id === id);
	return {
		method: 'espresso',
		grindOutput: result('grind-check')?.actual ?? null,
		shotSeconds: result('shot')?.seconds ?? null
	};
}
