import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import * as manifest from '../../../../package.json';
import ProjectMark from './ProjectMark.svelte';

function renderedMark(props: {
	isGreenlit: boolean;
	project: number;
	version?: string;
	scheme?: 'chronver' | 'semver';
}) {
	const screen = render(ProjectMark, props);
	return screen.container.querySelector('span')!.textContent;
}

describe('ProjectMark', () => {
	it('renders the mark for a bare chronver release', () => {
		const mark = renderedMark({
			isGreenlit: true,
			project: 3,
			version: '2026.11.13',
			scheme: 'chronver'
		});

		expect(mark).toBe('DW/G3-MK261113A');
	});

	it('renders the mark for the package.json version when no version is passed', () => {
		const mark = renderedMark({ isGreenlit: true, project: 3 });

		expect(mark).toBe(renderedMark({ isGreenlit: true, project: 3, version: manifest.version }));
	});

	it('renders the matching release letter for a same-day .N chronver release', () => {
		const cases = [
			{ version: '2026.11.13.3', expected: 'DW/G3-MK261113D' },
			{ version: '2026.11.13.25', expected: 'DW/G3-MK261113Z' },
			{ version: '2026.11.13.26', expected: 'DW/G3-MK261113AA' },
			{ version: '2026.11.13.701', expected: 'DW/G3-MK261113ZZ' }
		];

		for (const { version, expected } of cases) {
			const mark = renderedMark({ isGreenlit: true, project: 3, version, scheme: 'chronver' });

			expect(mark, version).toBe(expected);
		}
	});

	it('renders the experiment mark for a semver release', () => {
		const mark = renderedMark({
			isGreenlit: false,
			project: 7,
			version: '2.31.6',
			scheme: 'semver'
		});

		expect(mark).toBe('DW/E7-MK2-31-6');
	});

	it('throws an error naming the version when it cannot be encoded', () => {
		const cases = [
			{ version: '2026.11.13.702', scheme: 'chronver' as const },
			{ version: 'not-a-version', scheme: 'chronver' as const },
			{ version: '2.31', scheme: 'semver' as const }
		];

		for (const { version, scheme } of cases) {
			expect(
				() => render(ProjectMark, { isGreenlit: true, project: 3, version, scheme }),
				version
			).toThrow(version);
		}
	});
});
