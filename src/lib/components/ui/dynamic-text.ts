/** Fixed motion for DynamicText, tuned in a prototype. */
const TIMING = {
	/** Every duration and delay is divided by this. */
	speed: 0.8,
	/** Total stagger spread across all letters. */
	staggerWindowMs: 160,
	/** Lower clamp on the per-letter delay. */
	staggerMinMs: 8,
	/** Upper clamp on the per-letter delay. */
	staggerMaxMs: 28,
	/** One letter's blur, travel, and fade. */
	letterDurationMs: 220,
	/** Floor on the container width transition. */
	widthDurationMinMs: 200
} as const;

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
function perLetterDelayMs(letterCount: number): number {
	if (letterCount < 2) return 0;
	const spread = TIMING.staggerWindowMs / (letterCount - 1);
	return Math.min(TIMING.staggerMaxMs, Math.max(TIMING.staggerMinMs, spread));
}

export interface LetterSchedule {
	/** Delay between consecutive letters, speed applied. */
	staggerMs: number;
	/** One letter's transition duration, speed applied. */
	letterDurationMs: number;
	/** From the first letter starting to the last letter finishing, speed applied. */
	totalMs: number;
}

export function scheduleLetters(letterCount: number): LetterSchedule {
	const staggerMs = perLetterDelayMs(letterCount) / TIMING.speed;
	const letterDurationMs = TIMING.letterDurationMs / TIMING.speed;
	const lastLetterStartMs = staggerMs * Math.max(0, letterCount - 1);
	return {
		staggerMs,
		letterDurationMs,
		totalMs: letterCount === 0 ? 0 : lastLetterStartMs + letterDurationMs
	};
}

export const WIDTH_TRANSITION_MS =
	Math.max(TIMING.widthDurationMinMs, TIMING.letterDurationMs * 1.5) / TIMING.speed;
