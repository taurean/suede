// Stands in for the Bluetooth scale so the flow runs without hardware. It emits the
// same samples the scale does, on a virtual clock so long brews can be sped up.
import { resolveTarget, type EngineState, type Step } from './engine/steps';
import type { Sample } from './engine/timemore';

const SAMPLE_MS = 100;
const JITTER_G = 0.02;

type Motion = { from: number; to: number; startedAt: number; ms: number };
export type SimAction = { label: string; to: number; ms: number };

export function createSimScale(onSample: (sample: Sample) => void) {
	let now = Date.now();
	let grams = 0;
	let speed = 1;
	let motion: Motion | null = null;

	const timer = setInterval(() => {
		now += SAMPLE_MS * speed;
		if (motion) {
			const t = Math.min(1, (now - motion.startedAt) / motion.ms);
			grams = motion.from + (motion.to - motion.from) * t * t * (3 - 2 * t);
			if (t === 1) motion = null;
		}
		onSample({ at: now, grams: grams + (Math.random() - 0.5) * JITTER_G });
	}, SAMPLE_MS);

	return {
		now: () => now,
		isMoving: () => motion !== null,
		setSpeed: (next: number) => (speed = next),
		move: ({ to, ms }: SimAction) => (motion = { from: grams, to, startedAt: now, ms }),
		stop: () => clearInterval(timer)
	};
}

const PLACED_WEIGHT: Record<string, number> = {
	'dose-cup': 50,
	'receiving-cup': 30,
	'shot-cup': 200,
	vessel: 300
};

/** What a person would do next at the scale, given the step the engine is on. */
export function simActions(step: Step, engine: EngineState, grams: number): SimAction[] {
	const baseline = (id: string) => engine.baselines[id] ?? 0;
	const off = { label: 'Take it off', to: 0, ms: 600 };
	if (engine.awaitingClear) return grams > 1 ? [{ ...off, label: 'Clear the scale' }] : [];

	switch (step.kind) {
		case 'place': {
			if (step.on === 'vessel') return [{ label: 'Set brewer on', to: grams + 120, ms: 800 }];
			if (step.on === 'brewer') {
				const dose = (step.minRise ?? 0) + 1;
				return [{ label: 'Add grounds', to: baseline('brewer') + dose, ms: 2000 }];
			}
			return [{ label: 'Place it', to: PLACED_WEIGHT[step.id] ?? 50, ms: 800 }];
		}
		case 'fill': {
			const full = baseline(step.baselineFrom) + step.target;
			if (Math.abs(grams - full) < step.tolerance) return [off];
			return grams < full - step.target * 0.5
				? [{ label: 'Add most of it', to: full - step.target * 0.35, ms: 2500 }]
				: [{ label: 'Finish adding', to: full, ms: 2000 }];
		}
		case 'remove':
			if (step.yieldOver) {
				const brewer = engine.results.find((r) => r.id === 'brewer')?.actual ?? 120;
				return [{ label: 'Lift brewer off', to: grams - brewer, ms: 800 }];
			}
			return [off];
		case 'offScale': {
			if (step.id === 'grind') {
				const full = baseline('receiving-cup') + engine.results[1].target!;
				return [
					{ label: 'Set cup on', to: full - 0.1, ms: 800 },
					{ label: 'Set cup on, short', to: full - 0.7, ms: 800 }
				];
			}
			const weight = step.id === 'milk' ? 350 : step.stage === 'Prep' ? 300 : 200;
			return [{ label: step.id === 'milk' ? 'Set latte on' : 'Place it', to: weight, ms: 800 }];
		}
		case 'check': {
			const full = baseline(step.baselineFrom) + step.expected;
			if (grams < 1) return [{ label: 'Set cup back on', to: full - 0.1, ms: 800 }];
			return Math.abs(grams - full) <= step.tolerance
				? [off]
				: [{ ...off, label: 'Take off to regrind' }];
		}
		case 'fillTimed': {
			const target = resolveTarget(step.target, engine.results);
			const full = baseline(step.baselineFrom) + target;
			if (step.endsOn === 'removal') {
				return grams > full - 1 ? [off] : [{ label: 'Pull the shot', to: full, ms: 25500 }];
			}
			return [{ label: 'Pour', to: full, ms: Math.max(4000, target * 200) }];
		}
	}
}
