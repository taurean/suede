import { describe, expect, it } from 'vitest';
import { groupTokens, parseRootTokens } from './tokens';

const css = [
	'@layer base{:root{--hue-z0-bg:var(--hue-gray-50);--hue-z0-fg:var(--hue-gray-950)}',
	':root{--hue-red-50:oklch(98% 0.01 25);--hue-red-500:oklch(70% 0.2 25)}',
	':root{--hue-gray-50:oklch(98% 0.005 275);--hue-gray-950:oklch(19% 0.01 275)}',
	':root{--ff-mono:ui-monospace,monospace;--ff-code:var(--ff-mono)}',
	':root{--fs-0:clamp(0.6rem,1vw,0.7rem);--lh-ui:1;--space-sm:6px;--grid-columns:12;--shadow-1:none}',
	'.u\\:card{--space-sm:99px}',
	'@media (prefers-color-scheme:dark){:root{--hue-z0-bg:var(--hue-gray-950)}}}'
].join('');

describe('parseRootTokens', () => {
	it('keeps the first :root declaration and ignores other selectors and dark overrides', () => {
		const tokens = Object.fromEntries(parseRootTokens(css).map((t) => [t.name, t.value]));
		expect(tokens['space-sm']).toBe('6px');
		expect(tokens['hue-z0-bg']).toBe('var(--hue-gray-50)');
	});
});

describe('groupTokens', () => {
	const groups = groupTokens(css);

	it('pairs surface tokens with their dark-scheme value', () => {
		expect(groups.surfaces).toEqual([
			{ name: 'hue-z0-bg', value: 'var(--hue-gray-50)', dark: 'var(--hue-gray-950)' },
			{ name: 'hue-z0-fg', value: 'var(--hue-gray-950)', dark: undefined }
		]);
	});

	it('splits palette hues into chromatic and neutral by chroma', () => {
		expect(groups.chromaticHues.map((h) => h.name)).toEqual(['red']);
		expect(groups.neutralHues.map((h) => h.name)).toEqual(['gray']);
		expect(groups.chromaticHues[0].shades).toEqual({
			'50': 'oklch(98% 0.01 25)',
			'500': 'oklch(70% 0.2 25)'
		});
	});

	it('separates font role aliases from font stacks', () => {
		expect(groups.fontRoles.map((t) => t.name)).toEqual(['ff-code']);
		expect(groups.fontStacks.map((t) => t.name)).toEqual(['ff-mono']);
	});

	it('puts unrecognised prefixes in other instead of dropping them', () => {
		expect(groups.other).toEqual([{ name: 'shadow-1', value: 'none' }]);
	});
});
