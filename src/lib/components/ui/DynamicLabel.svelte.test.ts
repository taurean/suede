import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DynamicLabel from './DynamicLabel.svelte';
import { DEFAULT_TIMING, scheduleLetters, splitGraphemes } from './dynamic-label';

// Shrinks every duration so a full transition takes a few milliseconds.
const FAST_MOTION = '--dynamic-label-speed: 20';

function renderLabel(props: { text: string; announce?: boolean; style?: string }) {
	const screen = render(DynamicLabel, { style: FAST_MOTION, ...props });
	const label = screen.container.querySelector<HTMLElement>('.dynamic-label')!;
	const visibleText = () =>
		Array.from(label.querySelectorAll('.dynamic-label-letters .dynamic-label-letter'))
			.map((letter) => letter.textContent)
			.join('');
	const accessibleText = () => label.querySelector('.dynamic-label-accessible')!.textContent;
	return { ...screen, label, visibleText, accessibleText };
}

function emulateReducedMotion() {
	const realMatchMedia = window.matchMedia.bind(window);
	vi.spyOn(window, 'matchMedia').mockImplementation((query: string) =>
		query === '(prefers-reduced-motion: reduce)'
			? ({ ...realMatchMedia(query), matches: true, media: query } as MediaQueryList)
			: realMatchMedia(query)
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('DynamicLabel', () => {
	it('exposes the full text as one string and hides the per-letter spans', () => {
		const { label, accessibleText } = renderLabel({ text: 'New chat' });

		expect(accessibleText()).toBe('New chat');
		expect(label.querySelector('.dynamic-label-letters')!.getAttribute('aria-hidden')).toBe('true');
	});

	it('updates the accessible text to the new prop immediately', async () => {
		const screen = renderLabel({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });

		expect(screen.accessibleText()).toBe('Suede design system principles');
	});

	it('animates to the new text and releases the width lock when done', async () => {
		const screen = renderLabel({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });
		expect(screen.label.dataset.letterPhase).toBe('exiting');

		await vi.waitFor(() => {
			expect(screen.visibleText()).toBe('Suede design system principles');
			expect(screen.label.style.width).toBe('');
		});
		expect(screen.label.dataset.letterPhase).toBe('settled');
	});

	describe('when the text changes mid-transition', () => {
		const exitOf = (text: string) => scheduleLetters(splitGraphemes(text).length, DEFAULT_TIMING);

		afterEach(() => {
			vi.useRealTimers();
		});

		it('never shows the superseded text when interrupted while exiting', async () => {
			vi.useFakeTimers();
			const screen = renderLabel({ text: 'New chat', style: '' });

			await screen.rerender({ text: 'Suede design system principles' });
			await vi.advanceTimersByTimeAsync(50);
			await screen.rerender({ text: 'Settings' });

			// The superseded transition's enter would have fired here.
			await vi.advanceTimersByTimeAsync(exitOf('New chat').totalMs - 50 + 1);
			expect(screen.visibleText()).not.toBe('Suede design system principles');

			await vi.advanceTimersByTimeAsync(2000);
			expect(screen.visibleText()).toBe('Settings');
			expect(screen.label.dataset.letterPhase).toBe('settled');
			expect(screen.label.style.width).toBe('');
		});

		it('keeps the width locked when interrupted while entering', async () => {
			vi.useFakeTimers();
			const screen = renderLabel({ text: 'New chat', style: '' });

			await screen.rerender({ text: 'Suede design system principles' });
			await vi.advanceTimersByTimeAsync(exitOf('New chat').totalMs + 1);
			expect(screen.visibleText()).toBe('Suede design system principles');

			await screen.rerender({ text: 'Settings' });
			expect(screen.label.dataset.letterPhase).toBe('exiting');

			// The superseded transition's finish would have released the width here.
			await vi.advanceTimersByTimeAsync(exitOf('Suede design system principles').totalMs - 1);
			expect(screen.label.style.width).not.toBe('');

			await vi.advanceTimersByTimeAsync(2000);
			expect(screen.visibleText()).toBe('Settings');
			expect(screen.label.style.width).toBe('');
		});
	});

	it('swaps immediately with no blur, travel, or width lock under reduced motion', async () => {
		emulateReducedMotion();
		const screen = renderLabel({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });

		expect(screen.visibleText()).toBe('Suede design system principles');
		expect(screen.label.dataset.letterPhase).toBe('settled');
		expect(screen.label.style.width).toBe('');
	});

	it('only announces changes when opted in', () => {
		const quiet = renderLabel({ text: 'New chat' });
		expect(quiet.label.querySelector('.dynamic-label-accessible')!.hasAttribute('aria-live')).toBe(
			false
		);

		const announcing = renderLabel({ text: 'New chat', announce: true });
		expect(
			announcing.label.querySelector('.dynamic-label-accessible')!.getAttribute('aria-live')
		).toBe('polite');
	});
});
