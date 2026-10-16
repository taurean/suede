import { describe, expect, it } from 'vitest';
import {
	TIMING,
	WIDTH_TRANSITION_MS,
	perLetterDelayMs,
	scheduleLetters,
	splitGraphemes
} from './dynamic-text';

describe('splitGraphemes', () => {
	it('splits plain text into one entry per character, keeping spaces', () => {
		expect(splitGraphemes('New chat')).toEqual(['N', 'e', 'w', ' ', 'c', 'h', 'a', 't']);
	});

	it('keeps multi-code-point emoji whole', () => {
		const family = '👩‍👩‍👧';
		const flag = '🇯🇵';
		expect(splitGraphemes(`a${family}${flag}`)).toEqual(['a', family, flag]);
	});

	it('keeps a base letter and its combining mark together', () => {
		const decomposedE = 'é';
		expect(splitGraphemes(`caf${decomposedE}`)).toEqual(['c', 'a', 'f', decomposedE]);
	});

	it('returns no letters for empty text', () => {
		expect(splitGraphemes('')).toEqual([]);
	});
});

describe('perLetterDelayMs', () => {
	it('spreads the stagger window across the gaps between letters', () => {
		// 160ms over 9 gaps is ~17.8ms, inside the 8–28ms clamp.
		expect(perLetterDelayMs(10)).toBeCloseTo(160 / 9);
	});

	it('clamps short strings to the maximum delay', () => {
		// 160ms over 2 gaps would be 80ms per letter.
		expect(perLetterDelayMs(3)).toBe(28);
	});

	it('clamps long strings to the minimum delay', () => {
		// 160ms over 39 gaps would be ~4.1ms per letter.
		expect(perLetterDelayMs(40)).toBe(8);
	});

	it('has no stagger for zero or one letter', () => {
		expect(perLetterDelayMs(0)).toBe(0);
		expect(perLetterDelayMs(1)).toBe(0);
	});
});

describe('scheduleLetters', () => {
	it('divides stagger and duration by speed', () => {
		const schedule = scheduleLetters(10);
		expect(schedule.staggerMs).toBeCloseTo(160 / 9 / TIMING.speed);
		expect(schedule.letterDurationMs).toBe(220 / TIMING.speed);
	});

	it('ends when the last letter finishes', () => {
		expect(scheduleLetters(3).totalMs).toBeCloseTo((2 * 28 + 220) / TIMING.speed);
	});

	it('takes no time for empty text', () => {
		expect(scheduleLetters(0).totalMs).toBe(0);
	});
});

describe('WIDTH_TRANSITION_MS', () => {
	it('is 1.5× the letter duration, above the 200ms floor, divided by speed', () => {
		expect(WIDTH_TRANSITION_MS).toBeCloseTo((220 * 1.5) / TIMING.speed);
	});
});
