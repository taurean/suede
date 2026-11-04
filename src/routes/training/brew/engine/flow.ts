import type { Sample } from './timemore';

/** Flow rate is the weight change across this window, which smooths the scale's jitter. */
export const FLOW_WINDOW_MS = 1500;

export type Point = { seconds: number; value: number };

/** Weight (change from baseline) and flow rate in g/s, both against seconds since `startAt`. */
export function shotSeries(samples: Sample[], startAt: number, baseline: number) {
	const shot = samples.filter((s) => s.at >= startAt);
	const weight: Point[] = shot.map((s) => ({
		seconds: (s.at - startAt) / 1000,
		value: s.grams - baseline
	}));
	const flow: Point[] = [];
	let tail = 0;
	for (const s of shot) {
		while (shot[tail].at < s.at - FLOW_WINDOW_MS) tail++;
		const from = shot[tail];
		const elapsed = (s.at - from.at) / 1000;
		if (elapsed > 0) {
			flow.push({
				seconds: (s.at - startAt) / 1000,
				value: Math.max(0, (s.grams - from.grams) / elapsed)
			});
		}
	}
	return { weight, flow };
}
