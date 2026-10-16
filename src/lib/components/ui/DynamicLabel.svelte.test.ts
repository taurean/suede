import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DynamicLabel from './DynamicLabel.svelte';
import { scheduleLetters, splitGraphemes } from './dynamic-label';

const exitOf = (text: string) => scheduleLetters(splitGraphemes(text).length);

function renderLabel(props: { text: string; announce?: boolean }) {
	const screen = render(DynamicLabel, props);
	const label = screen.container.querySelector<HTMLElement>('.dynamic-label')!;
	const visibleText = () =>
		Array.from(label.querySelectorAll('.dynamic-label-letters .dynamic-label-letter'))
			.map((letter) => letter.textContent)
			.join('');
	const accessibleRegion = () => label.querySelector('.dynamic-label-accessible')!;
	return { ...screen, label, visibleText, accessibleRegion };
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
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe('DynamicLabel', () => {
	it('exposes the full text as one string and hides the per-letter spans', () => {
		const { label, accessibleRegion } = renderLabel({ text: 'New chat' });

		expect(accessibleRegion().textContent).toBe('New chat');
		expect(label.querySelector('.dynamic-label-letters')!.getAttribute('aria-hidden')).toBe('true');
	});

	it('updates the accessible text to the new prop immediately', async () => {
		const screen = renderLabel({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });

		expect(screen.accessibleRegion().textContent).toBe('Suede design system principles');
	});

	it('animates to the new text when the prop changes, then releases the width lock', async () => {
		vi.useFakeTimers();
		const screen = renderLabel({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });
		expect(screen.label.dataset.letterPhase).toBe('exiting');
		expect(screen.visibleText()).toBe('New chat');

		await vi.advanceTimersByTimeAsync(2000);
		expect(screen.visibleText()).toBe('Suede design system principles');
		expect(screen.label.dataset.letterPhase).toBe('settled');
		expect(screen.label.style.width).toBe('');
	});

	describe('when the text changes mid-transition', () => {
		it('never shows the superseded text when interrupted while exiting', async () => {
			vi.useFakeTimers();
			const screen = renderLabel({ text: 'New chat' });

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
			const screen = renderLabel({ text: 'New chat' });

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

	it('announces changes politely by default', () => {
		const { accessibleRegion } = renderLabel({ text: 'New chat' });

		expect(accessibleRegion().getAttribute('aria-live')).toBe('polite');
		expect(accessibleRegion().getAttribute('aria-atomic')).toBe('true');
	});

	it('does not announce when opted out', () => {
		const { accessibleRegion } = renderLabel({ text: 'New chat', announce: false });

		expect(accessibleRegion().hasAttribute('aria-live')).toBe(false);
	});
});
