import { describe, expect, it, vi } from 'vitest';
import {
	DEFAULT_TIMING,
	parseCustomPropertyNumber,
	perLetterDelayMs,
	readTiming,
	scheduleLetters,
	splitGraphemes,
	widthTransitionMs
} from './dynamic-label';

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
		expect(perLetterDelayMs(10, DEFAULT_TIMING)).toBeCloseTo(160 / 9);
	});

	it('clamps short strings to the maximum delay', () => {
		// 160ms over 2 gaps would be 80ms per letter.
		expect(perLetterDelayMs(3, DEFAULT_TIMING)).toBe(28);
	});

	it('clamps long strings to the minimum delay', () => {
		// 160ms over 39 gaps would be ~4.1ms per letter.
		expect(perLetterDelayMs(40, DEFAULT_TIMING)).toBe(8);
	});

	it('has no stagger for zero or one letter', () => {
		expect(perLetterDelayMs(0, DEFAULT_TIMING)).toBe(0);
		expect(perLetterDelayMs(1, DEFAULT_TIMING)).toBe(0);
	});
});

describe('scheduleLetters', () => {
	it('divides stagger and duration by speed', () => {
		const schedule = scheduleLetters(10, { ...DEFAULT_TIMING, speed: 2 });
		expect(schedule.staggerMs).toBeCloseTo(160 / 9 / 2);
		expect(schedule.letterDurationMs).toBe(110);
	});

	it('ends when the last letter finishes', () => {
		const schedule = scheduleLetters(3, DEFAULT_TIMING);
		expect(schedule.totalMs).toBeCloseTo((2 * 28 + 220) / 0.8);
	});

	it('takes no time for empty text', () => {
		expect(scheduleLetters(0, DEFAULT_TIMING).totalMs).toBe(0);
	});
});

describe('widthTransitionMs', () => {
	it('is 1.5× the letter duration when that exceeds the floor, divided by speed', () => {
		expect(widthTransitionMs(DEFAULT_TIMING)).toBeCloseTo((220 * 1.5) / 0.8);
	});

	it('never drops below the floor', () => {
		expect(widthTransitionMs({ ...DEFAULT_TIMING, letterDurationMs: 50, speed: 1 })).toBe(200);
	});
});

describe('parseCustomPropertyNumber', () => {
	it('reads ms, s, and bare-number times', () => {
		expect(parseCustomPropertyNumber(' 120ms', 'time')).toBe(120);
		expect(parseCustomPropertyNumber('0.3s', 'time')).toBe(300);
		expect(parseCustomPropertyNumber('90', 'time')).toBe(90);
	});

	it('treats unset or unparseable values as absent', () => {
		expect(parseCustomPropertyNumber('', 'plain')).toBeUndefined();
		expect(parseCustomPropertyNumber('fast', 'plain')).toBeUndefined();
	});
});

describe('readTiming', () => {
	const styleWith = (properties: Record<string, string>) => ({
		getPropertyValue: (name: string) => properties[name] ?? ''
	});

	it('uses the defaults when no property is set', () => {
		expect(readTiming(styleWith({}))).toEqual(DEFAULT_TIMING);
	});

	it('applies per-instance overrides', () => {
		const timing = readTiming(
			styleWith({ '--dynamic-label-speed': '1.5', '--dynamic-label-letter-duration': '0.4s' })
		);
		expect(timing.speed).toBe(1.5);
		expect(timing.letterDurationMs).toBe(400);
		expect(timing.staggerWindowMs).toBe(DEFAULT_TIMING.staggerWindowMs);
	});

	it('rejects a non-positive speed with a warning', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		expect(readTiming(styleWith({ '--dynamic-label-speed': '0' })).speed).toBe(
			DEFAULT_TIMING.speed
		);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('--dynamic-label-speed'));
		warn.mockRestore();
	});
});
