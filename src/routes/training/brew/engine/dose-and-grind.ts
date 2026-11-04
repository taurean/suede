import type { Step } from './steps';

export const DOSE_TOLERANCE_G = 0.1;
export const GRIND_TOLERANCE_G = 0.4;

/** Weigh the beans, weigh the empty receiving cup, grind, check the output. Every method starts here. */
export function doseAndGrindSteps(dose: number): Step[] {
	return [
		{ id: 'dose-cup', kind: 'place', stage: 'Dose', prompt: 'Place the dosing cup' },
		{
			id: 'dose',
			kind: 'fill',
			stage: 'Dose',
			prompt: 'Add beans',
			baselineFrom: 'dose-cup',
			target: dose,
			tolerance: DOSE_TOLERANCE_G
		},
		{
			id: 'receiving-cup',
			kind: 'place',
			stage: 'Weigh receiving cup',
			prompt: 'Place the empty receiving cup'
		},
		{
			id: 'receiving-cup-off',
			kind: 'remove',
			stage: 'Weigh receiving cup',
			prompt: 'Take it off'
		},
		{ id: 'grind', kind: 'offScale', stage: 'Grind', prompt: 'Grind, then place the cup' },
		{
			id: 'grind-check',
			kind: 'check',
			stage: 'Check grind',
			prompt: 'Checking ground output',
			baselineFrom: 'receiving-cup',
			expected: dose,
			tolerance: GRIND_TOLERANCE_G
		}
	];
}
