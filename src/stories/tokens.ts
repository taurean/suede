export interface Token {
	name: string;
	value: string;
}

export interface Hue {
	name: string;
	shades: Record<string, string>;
}

export interface TokenGroups {
	surfaces: (Token & { dark?: string })[];
	chromaticHues: Hue[];
	neutralHues: Hue[];
	fontRoles: Token[];
	fontStacks: Token[];
	fontSizes: Token[];
	lineHeights: Token[];
	spacing: Token[];
	grid: Token[];
	other: Token[];
}

// Below this OKLCH chroma at every shade, a hue reads as a tinted neutral
// (slate, zinc, sand…) rather than a colour.
const NEUTRAL_MAX_CHROMA = 0.05;

const ROOT_BLOCK = /(?<=^|[{}])\s*:root\s*\{([^{}]*)\}/g;
const DARK_ROOT_BLOCK = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([^{}]*)\}/g;
const DECLARATION = /--([\w-]+)\s*:([^;]*)/g;
const PALETTE_SHADE = /^hue-([a-zA-Z]+)-(\d+)$/;
const SURFACE = /^hue-z\d+-/;

function declarations(block: string): Token[] {
	return [...block.matchAll(DECLARATION)].map(([, name, value]) => ({
		name,
		value: value.replace(/\s+/g, ' ').trim()
	}));
}

/** Custom properties declared on `:root`, in source order, first declaration wins. */
export function parseRootTokens(css: string): Token[] {
	const tokens = new Map<string, string>();
	for (const [, block] of css.matchAll(ROOT_BLOCK)) {
		for (const { name, value } of declarations(block)) {
			if (!tokens.has(name)) tokens.set(name, value);
		}
	}
	return [...tokens].map(([name, value]) => ({ name, value }));
}

function parseDarkOverrides(css: string): Map<string, string> {
	const overrides = new Map<string, string>();
	for (const [, block] of css.matchAll(DARK_ROOT_BLOCK)) {
		for (const { name, value } of declarations(block)) overrides.set(name, value);
	}
	return overrides;
}

function oklchChroma(value: string): number | undefined {
	const match = value.match(/oklch\(\s*[\d.]+%?\s+([\d.]+)/);
	return match ? Number(match[1]) : undefined;
}

function isNeutral(hue: Hue): boolean {
	return Object.values(hue.shades).every((value) => {
		const chroma = oklchChroma(value);
		return chroma !== undefined && chroma < NEUTRAL_MAX_CHROMA;
	});
}

export function groupTokens(css: string): TokenGroups {
	const dark = parseDarkOverrides(css);
	const groups: TokenGroups = {
		surfaces: [],
		chromaticHues: [],
		neutralHues: [],
		fontRoles: [],
		fontStacks: [],
		fontSizes: [],
		lineHeights: [],
		spacing: [],
		grid: [],
		other: []
	};
	const hues = new Map<string, Hue>();

	for (const token of parseRootTokens(css)) {
		const shade = token.name.match(PALETTE_SHADE);
		if (SURFACE.test(token.name)) {
			groups.surfaces.push({ ...token, dark: dark.get(token.name) });
		} else if (shade) {
			const [, hueName, step] = shade;
			const hue = hues.get(hueName) ?? { name: hueName, shades: {} };
			hue.shades[step] = token.value;
			hues.set(hueName, hue);
		} else if (token.name.startsWith('ff-')) {
			// Role aliases point at a stack; stacks list actual font names.
			const target = token.value.startsWith('var(') ? groups.fontRoles : groups.fontStacks;
			target.push(token);
		} else if (token.name.startsWith('fs-')) {
			groups.fontSizes.push(token);
		} else if (token.name.startsWith('lh-')) {
			groups.lineHeights.push(token);
		} else if (token.name.startsWith('space-')) {
			groups.spacing.push(token);
		} else if (token.name.startsWith('grid-')) {
			groups.grid.push(token);
		} else {
			groups.other.push(token);
		}
	}

	for (const hue of hues.values()) {
		(isNeutral(hue) ? groups.neutralHues : groups.chromaticHues).push(hue);
	}
	return groups;
}
