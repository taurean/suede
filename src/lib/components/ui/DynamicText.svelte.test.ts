import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DynamicText from './DynamicText.svelte';

// Longer than any transition, so every pending step has run.
const SETTLE_MS = 5000;

function renderText(props: { text: string; announce?: boolean }) {
	const screen = render(DynamicText, props);
	const root = screen.container.querySelector<HTMLElement>('.dynamic-text')!;
	const visibleLetters = () =>
		Array.from(root.querySelectorAll('.dynamic-text-letters .dynamic-text-letter'), (letter) =>
			String(letter.textContent)
		);
	const accessibleRegion = () => root.querySelector('.dynamic-text-accessible')!;
	return { ...screen, root, visibleLetters, accessibleRegion };
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

describe('DynamicText', () => {
	it('exposes the text as one string and hides the per-letter spans', () => {
		const { root, accessibleRegion } = renderText({ text: 'New chat' });

		expect(accessibleRegion().textContent).toBe('New chat');
		expect(root.querySelector('.dynamic-text-letters')!.getAttribute('aria-hidden')).toBe('true');
	});

	it('updates the accessible text as soon as the prop changes', async () => {
		const screen = renderText({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });

		expect(screen.accessibleRegion().textContent).toBe('Suede design system principles');
	});

	it('shows the new text and releases its width once the change settles', async () => {
		vi.useFakeTimers();
		const screen = renderText({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });
		await vi.advanceTimersByTimeAsync(SETTLE_MS);

		expect(screen.visibleLetters().join('')).toBe('Suede design system principles');
		expect(screen.root.style.width).toBe('');
	});

	it('settles on the newest text when it changes several times in a row', async () => {
		vi.useFakeTimers();
		const screen = renderText({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });
		await vi.advanceTimersByTimeAsync(50);
		await screen.rerender({ text: 'Settings' });
		await vi.advanceTimersByTimeAsync(SETTLE_MS);

		expect(screen.visibleLetters().join('')).toBe('Settings');
		expect(screen.root.style.width).toBe('');
	});

	it('keeps emoji and accented letters whole', () => {
		const family = '👩‍👩‍👧';
		const decomposedE = 'é';
		const { visibleLetters } = renderText({ text: `caf${decomposedE} ${family}` });

		expect(visibleLetters()).toEqual(['c', 'a', 'f', decomposedE, ' ', family]);
	});

	it('swaps immediately when the user prefers reduced motion', async () => {
		emulateReducedMotion();
		const screen = renderText({ text: 'New chat' });

		await screen.rerender({ text: 'Suede design system principles' });

		expect(screen.visibleLetters().join('')).toBe('Suede design system principles');
		expect(screen.root.style.width).toBe('');
	});

	it('announces changes politely by default', () => {
		const { accessibleRegion } = renderText({ text: 'New chat' });

		expect(accessibleRegion().getAttribute('aria-live')).toBe('polite');
		expect(accessibleRegion().getAttribute('aria-atomic')).toBe('true');
	});

	it('does not announce when opted out', () => {
		const { accessibleRegion } = renderText({ text: 'New chat', announce: false });

		expect(accessibleRegion().hasAttribute('aria-live')).toBe(false);
	});
});
