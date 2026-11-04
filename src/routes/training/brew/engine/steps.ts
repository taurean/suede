// The step engine. A recipe is a list of steps; the engine walks it one scale
// sample at a time. The app never asks for a tare: each container's settled
// weight becomes a baseline, and weighing steps measure the change from it.
//
// `feed` is a pure function: (state, recipe, sample) -> next state.

import type { Sample } from './timemore';

// Thresholds. Tune these against the real scale.
export const SETTLE_BAND_G = 0.1; // a reading is settled when it stays within this band...
export const SETTLE_MS = 1000; // ...for this long
export const EMPTY_G = 1; // below this the scale counts as clear
export const PLACED_G = 3; // a settled reading above this counts as a container
export const CHANGE_G = 2; // off-scale steps advance on a change bigger than this
export const FIRST_DROPS_G = 0.3; // timed steps start when the change passes this...
export const FIRST_DROPS_HOLD_MS = 500; // ...and stays above it this long
export const LIFT_DROP_G = 20; // a stacked item counts as lifted when weight falls this far from its peak

type StepBase = {
	id: string;
	/** The stage name shown on screen. Several steps can share one stage. */
	stage: string;
	prompt: string;
};

export type Step =
	/**
	 * Something goes on the scale. Its settled reading becomes this step's baseline.
	 * With `on`, it goes on top of an earlier step's item: it must rise `minRise`
	 * above that baseline (default PLACED_G), and the rise is recorded as `actual`.
	 */
	| (StepBase & { kind: 'place'; on?: string; minRise?: number })
	/** Add until the change from a baseline reaches the target, then take the container off. */
	| (StepBase & { kind: 'fill'; baselineFrom: string; target: number; tolerance: number })
	/**
	 * Like fill, with a timer that starts at first drops and carries across timed steps.
	 * endsOn 'removal': ends when the container comes off.
	 * endsOn 'target': ends once the target is reached, and if `holdToWindow`, not
	 * before targetSeconds, so the next pour starts on time.
	 */
	| (StepBase & { kind: 'fillTimed'; baselineFrom: string; targetSeconds: number } & (
				| { endsOn: 'removal'; target: number }
				| { endsOn: 'target'; target: Target; tolerance: number; holdToWindow: boolean }
			))
	/** Compare the change from a baseline to an expected value. Repeats until it passes, then the container comes off. */
	| (StepBase & { kind: 'check'; baselineFrom: string; expected: number; tolerance: number })
	/**
	 * Weight returns to near zero. With `yieldOver`, an item lifts off a stack
	 * instead: `actual` is what remains above that earlier step's baseline.
	 */
	| (StepBase & { kind: 'remove'; yieldOver?: string })
	/** Work happens away from the scale. The next scale change advances. */
	| (StepBase & { kind: 'offScale' });

/** A fixed weight, or a multiple of what an earlier step actually measured. */
export type Target = number | { timesActualOf: string; times: number };

export type StepResult = {
	id: string;
	kind: Step['kind'];
	startedAt: number;
	endedAt: number;
	baseline?: number;
	target?: number;
	actual?: number;
	/** Seconds on the shared timer: when flow stopped, a target was reached, or an item lifted. */
	seconds?: number;
	/** Highest reading during a stacked remove. */
	peak?: number;
};

export type EngineState = {
	index: number;
	done: boolean;
	/** Set on start and restart: samples are ignored until the scale is clear. */
	awaitingClear: boolean;
	/** Samples covering the last SETTLE_MS, for the settle check. */
	recent: Sample[];
	baselines: Record<string, number>;
	results: StepResult[];
	restarts: number;
	/** Shared by every timed step in a brew. */
	timerStartedAt: number | null;
	// Per-step fields, reset whenever the step changes.
	stepStartedAt: number | null;
	entryGrams: number | null;
	lastSettledChange: number | null;
	peakChange: number | null;
	dropsCandidateAt: number | null;
	timerEndedAt: number | null;
	targetReachedAt: number | null;
	liftedAt: number | null;
};

const freshStep = {
	stepStartedAt: null,
	entryGrams: null,
	lastSettledChange: null,
	peakChange: null,
	dropsCandidateAt: null,
	timerEndedAt: null,
	targetReachedAt: null,
	liftedAt: null
};

export function startEngine(): EngineState {
	return {
		index: 0,
		done: false,
		awaitingClear: true,
		recent: [],
		baselines: {},
		results: [],
		restarts: 0,
		timerStartedAt: null,
		...freshStep
	};
}

/** The settled reading, or null if the last SETTLE_MS moved more than SETTLE_BAND_G. */
export function settledGrams(recent: Sample[]): number | null {
	if (recent.length === 0) return null;
	const last = recent[recent.length - 1];
	if (last.at - recent[0].at < SETTLE_MS) return null;
	const values = recent.map((s) => s.grams);
	if (Math.max(...values) - Math.min(...values) > SETTLE_BAND_G) return null;
	return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

/** Keeps the samples in the settle window, plus the one just before it so the window is fully covered. */
function trimToWindow(recent: Sample[], sample: Sample): Sample[] {
	const next = [...recent, sample];
	while (next.length > 1 && next[1].at <= sample.at - SETTLE_MS) next.shift();
	return next;
}

export function canRestart(step: Step): boolean {
	return step.kind === 'place' || step.kind === 'fill' || step.kind === 'check';
}

/** Resolves a target against what earlier steps measured. */
export function resolveTarget(target: Target, results: StepResult[]): number {
	if (typeof target === 'number') return target;
	const actual = results.find((r) => r.id === target.timesActualOf)?.actual;
	if (actual === undefined) throw new Error(`No measured result for ${target.timesActualOf}`);
	return round1(actual * target.times);
}

/** The bottom of the stack this step builds on. Clearing the scale removes all of it. */
function restartStepIndex(step: Step, steps: Step[]): number {
	let current = step;
	while (true) {
		const below =
			'baselineFrom' in current
				? current.baselineFrom
				: current.kind === 'place'
					? current.on
					: undefined;
		if (below === undefined) return steps.indexOf(current);
		current = steps.find((s) => s.id === below)!;
	}
}

/** Goes back to the first container this step depends on, and waits for a clear scale. */
export function restart(state: EngineState, steps: Step[]): EngineState {
	const step = steps[state.index];
	if (!canRestart(step)) return state;
	const index = restartStepIndex(step, steps);
	const keptIds = new Set(steps.slice(0, index).map((s) => s.id));
	return {
		...state,
		...freshStep,
		index,
		awaitingClear: true,
		timerStartedAt: null,
		recent: [],
		results: state.results.filter((r) => keptIds.has(r.id)),
		restarts: state.restarts + 1
	};
}

function complete(
	state: EngineState,
	steps: Step[],
	at: number,
	result: Omit<StepResult, 'id' | 'kind' | 'startedAt' | 'endedAt'>
): EngineState {
	const step = steps[state.index];
	const index = state.index + 1;
	return {
		...state,
		...freshStep,
		index,
		done: index >= steps.length,
		recent: [],
		results: [
			...state.results,
			{ id: step.id, kind: step.kind, startedAt: state.stepStartedAt ?? at, endedAt: at, ...result }
		]
	};
}

export function feed(prev: EngineState, steps: Step[], sample: Sample): EngineState {
	if (prev.done) return prev;
	if (prev.awaitingClear) {
		return sample.grams < EMPTY_G ? { ...prev, awaitingClear: false } : prev;
	}

	const state: EngineState = {
		...prev,
		recent: trimToWindow(prev.recent, sample),
		stepStartedAt: prev.stepStartedAt ?? sample.at
	};
	const step = steps[state.index];
	const settled = settledGrams(state.recent);
	const isClear = sample.grams < EMPTY_G;

	switch (step.kind) {
		case 'place': {
			const below = step.on === undefined ? 0 : state.baselines[step.on];
			if (settled === null || settled <= below + (step.minRise ?? PLACED_G)) return state;
			const baselines = { ...state.baselines, [step.id]: settled };
			return complete({ ...state, baselines }, steps, sample.at, {
				baseline: settled,
				actual: step.on === undefined ? undefined : round1(settled - below)
			});
		}

		case 'remove': {
			if (step.yieldOver === undefined) {
				return isClear ? complete(state, steps, sample.at, {}) : state;
			}
			// Water draining inside the stack doesn't change the total, so the lift
			// is the only signal. The peak survives drip noise that a settle check wouldn't.
			const peak = Math.max(state.peakChange ?? sample.grams, sample.grams);
			state.peakChange = peak;
			if (peak - sample.grams > LIFT_DROP_G) state.liftedAt ??= sample.at;
			if (state.liftedAt === null || settled === null || peak - settled <= LIFT_DROP_G) {
				return state;
			}
			return complete(state, steps, sample.at, {
				baseline: state.baselines[step.yieldOver],
				actual: round1(settled - state.baselines[step.yieldOver]),
				peak,
				seconds:
					state.timerStartedAt === null
						? undefined
						: round1((state.liftedAt - state.timerStartedAt) / 1000)
			});
		}

		case 'offScale': {
			if (state.entryGrams === null) return { ...state, entryGrams: sample.grams };
			const changed = Math.abs(sample.grams - state.entryGrams) > CHANGE_G;
			return changed ? complete(state, steps, sample.at, {}) : state;
		}

		case 'fill':
		case 'check': {
			const baseline = state.baselines[step.baselineFrom];
			const target = step.kind === 'fill' ? step.target : step.expected;
			if (settled !== null && settled > EMPTY_G) state.lastSettledChange = settled - baseline;
			if (!isClear || state.lastSettledChange === null) return state;

			// The container just came off. Judge the last settled reading.
			const actual = round1(state.lastSettledChange);
			if (isWithin(actual, target, step.tolerance)) {
				return complete(state, steps, sample.at, { baseline, target, actual });
			}
			// A fill cleared early starts over. A check waits for the regrind.
			return step.kind === 'fill' ? restart(state, steps) : { ...state, lastSettledChange: null };
		}

		case 'fillTimed': {
			const baseline = state.baselines[step.baselineFrom];
			const change = sample.grams - baseline;

			if (state.timerStartedAt === null) {
				if (change <= FIRST_DROPS_G) return { ...state, dropsCandidateAt: null };
				const candidate = state.dropsCandidateAt ?? sample.at;
				const held = sample.at - candidate >= FIRST_DROPS_HOLD_MS;
				return { ...state, dropsCandidateAt: candidate, timerStartedAt: held ? candidate : null };
			}

			if (step.endsOn === 'target') {
				const target = resolveTarget(step.target, state.results);
				if (change >= target - step.tolerance) state.targetReachedAt ??= sample.at;
				if (state.targetReachedAt === null) return state;
				const elapsed = (sample.at - state.timerStartedAt) / 1000;
				if (step.holdToWindow && elapsed < step.targetSeconds) return state;
				return complete(state, steps, sample.at, {
					baseline,
					target,
					actual: round1(change),
					seconds: round1((state.targetReachedAt - state.timerStartedAt) / 1000)
				});
			}

			if (isClear) {
				const endedAt = state.timerEndedAt ?? sample.at;
				return complete(state, steps, sample.at, {
					baseline,
					target: step.target,
					actual: round1(state.lastSettledChange ?? state.peakChange ?? 0),
					seconds: round1((endedAt - state.timerStartedAt) / 1000)
				});
			}

			state.peakChange = Math.max(state.peakChange ?? change, change);
			if (settled !== null) {
				// Flow stopped: the shot ended where the settled window began.
				state.lastSettledChange = settled - baseline;
				state.timerEndedAt ??= state.recent[0].at;
			} else if (
				state.lastSettledChange !== null &&
				change > state.lastSettledChange + SETTLE_BAND_G
			) {
				// More drops after a pause: the shot is still running.
				state.timerEndedAt = null;
			}
			return state;
		}
	}
}

/** Tolerance check that survives float error: 18.1 - 18 is 0.1000000000000014. */
export function isWithin(actual: number, target: number, tolerance: number): boolean {
	return Math.abs(actual - target) <= tolerance + 1e-9;
}

function round1(n: number): number {
	return Math.round(n * 10) / 10;
}
