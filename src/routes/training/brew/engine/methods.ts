// The method registry. To add a method: write its steps and record as plain
// data in its own file, add an entry here, and add its fields to the Brew type.

import { ESPRESSO_RATIO, espressoRecord, espressoSteps } from './espresso';
import { POUR_OVER_RATIO, pourOverRecord, pourOverSteps } from './pourover';
import type { Step, StepResult } from './steps';

export type Setup = { dose: number; waterTemp: number };

export const METHODS = {
	espresso: {
		label: 'Espresso',
		ratio: ESPRESSO_RATIO,
		rateLabel: 'Flow (g/s)',
		steps: ({ dose }: Setup): Step[] => espressoSteps(dose),
		record: (results: StepResult[]) => espressoRecord(results)
	},
	pourover: {
		label: 'Pour-over',
		ratio: POUR_OVER_RATIO,
		rateLabel: 'Pour rate (g/s)',
		steps: ({ dose, waterTemp }: Setup): Step[] => pourOverSteps(dose, waterTemp),
		record: (results: StepResult[], { waterTemp }: Setup) => pourOverRecord(results, waterTemp)
	}
};

export type MethodId = keyof typeof METHODS;
