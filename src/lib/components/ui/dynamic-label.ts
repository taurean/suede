/**
 * Timing knobs for DynamicLabel. Each is overridable per instance through the
 * CSS custom property named alongside it; the values here are the defaults
 * used when the property is unset. They live in TypeScript rather than in CSS
 * `var()` fallbacks because the component schedules its phase changes from
 * them, so script is the one place that needs every value resolved.
 */
export interface DynamicLabelTiming {
	/** `--dynamic-label-speed`. Every duration and delay is divided by this. */
	speed: number;
	/** `--dynamic-label-stagger-window`. Total stagger spread across all letters. */
	staggerWindowMs: number;
	/** `--dynamic-label-stagger-min`. Lower clamp on the per-letter delay. */
	staggerMinMs: number;
	/** `--dynamic-label-stagger-max`. Upper clamp on the per-letter delay. */
	staggerMaxMs: number;
	/** `--dynamic-label-letter-duration`. One letter's blur/travel/fade. */
	letterDurationMs: number;
	/** `--dynamic-label-width-duration-min`. Floor on the container width transition. */
	widthDurationMinMs: number;
}

export const DEFAULT_TIMING: DynamicLabelTiming = {
	speed: 0.8,
	staggerWindowMs: 160,
	staggerMinMs: 8,
	staggerMaxMs: 28,
	letterDurationMs: 220,
	widthDurationMinMs: 200
};

const TIMING_PROPERTIES: Record<keyof DynamicLabelTiming, string> = {
	speed: '--dynamic-label-speed',
	staggerWindowMs: '--dynamic-label-stagger-window',
	staggerMinMs: '--dynamic-label-stagger-min',
	staggerMaxMs: '--dynamic-label-stagger-max',
	letterDurationMs: '--dynamic-label-letter-duration',
	widthDurationMinMs: '--dynamic-label-width-duration-min'
};

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

/** Splits text into user-perceived characters, keeping emoji and combining sequences whole. */
export function splitGraphemes(text: string): string[] {
	return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
}

/**
 * Delay between consecutive letters, before the speed multiplier: the stagger
 * window spread across the gaps between letters, clamped so short strings
 * don't crawl and long strings don't blur into one motion. A single letter has
 * no gaps, so it has no stagger.
 */
export function perLetterDelayMs(letterCount: number, timing: DynamicLabelTiming): number {
	if (letterCount < 2) return 0;
	const spread = timing.staggerWindowMs / (letterCount - 1);
	return Math.min(timing.staggerMaxMs, Math.max(timing.staggerMinMs, spread));
}

export interface LetterSchedule {
	/** Delay between consecutive letters, speed applied. */
	staggerMs: number;
	/** One letter's transition duration, speed applied. */
	letterDurationMs: number;
	/** From the first letter starting to the last letter finishing, speed applied. */
	totalMs: number;
}

export function scheduleLetters(letterCount: number, timing: DynamicLabelTiming): LetterSchedule {
	const staggerMs = perLetterDelayMs(letterCount, timing) / timing.speed;
	const letterDurationMs = timing.letterDurationMs / timing.speed;
	const lastLetterStartMs = staggerMs * Math.max(0, letterCount - 1);
	return {
		staggerMs,
		letterDurationMs,
		totalMs: letterCount === 0 ? 0 : lastLetterStartMs + letterDurationMs
	};
}

export function widthTransitionMs(timing: DynamicLabelTiming): number {
	return Math.max(timing.widthDurationMinMs, timing.letterDurationMs * 1.5) / timing.speed;
}

/**
 * Parses a custom property value as a number. Times accept `ms`, `s`, or a
 * bare number of milliseconds. An unset or unparseable value yields
 * `undefined` so the caller falls back to the documented default.
 */
export function parseCustomPropertyNumber(raw: string, unit: 'time' | 'plain'): number | undefined {
	const value = raw.trim();
	if (value === '') return undefined;
	const parsed = Number.parseFloat(value);
	if (!Number.isFinite(parsed)) return undefined;
	if (unit === 'time' && value.endsWith('ms')) return parsed;
	if (unit === 'time' && value.endsWith('s')) return parsed * 1000;
	return parsed;
}

/** Resolves timing from an element's computed custom properties, defaulting each unset one. */
export function readTiming(
	style: Pick<CSSStyleDeclaration, 'getPropertyValue'>
): DynamicLabelTiming {
	const resolved = { ...DEFAULT_TIMING };
	for (const key of Object.keys(TIMING_PROPERTIES) as (keyof DynamicLabelTiming)[]) {
		const unit = key === 'speed' ? 'plain' : 'time';
		const override = parseCustomPropertyNumber(
			style.getPropertyValue(TIMING_PROPERTIES[key]),
			unit
		);
		if (override !== undefined) resolved[key] = override;
	}
	if (resolved.speed <= 0) {
		console.warn(
			`DynamicLabel: --dynamic-label-speed must be positive, got ${resolved.speed}; using ${DEFAULT_TIMING.speed}.`
		);
		resolved.speed = DEFAULT_TIMING.speed;
	}
	return resolved;
}
