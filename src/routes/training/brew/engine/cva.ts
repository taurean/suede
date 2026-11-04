// SCA Coffee Value Assessment, adapted for a single cup.

export const RATED_ATTRIBUTES = [
	'fragrance',
	'aroma',
	'flavor',
	'aftertaste',
	'acidity',
	'sweetness',
	'mouthfeel',
	'overall'
] as const;
export type RatedAttribute = (typeof RATED_ATTRIBUTES)[number];

export const DESCRIBED_ATTRIBUTES = [
	'aroma',
	'flavor',
	'aftertaste',
	'acidity',
	'sweetness',
	'mouthfeel'
] as const;
export type DescribedAttribute = (typeof DESCRIBED_ATTRIBUTES)[number];

/** Intensity on the CVA descriptive 0-15 scale, plus free-text notes. */
export type Description = { intensity: number; notes: string[] };

/**
 * The CVA affective score: 0.65625 x (sum of eight 1-9 ratings) + 52.75.
 * The published form also subtracts 2 per non-uniform cup and 4 per defective
 * cup; a single espresso has neither, so they're left out.
 */
export function cvaScore(ratings: Record<RatedAttribute, number>): number {
	const sum = RATED_ATTRIBUTES.reduce((total, key) => total + ratings[key], 0);
	return Math.round((0.65625 * sum + 52.75) * 100) / 100;
}

export function scoreBand(score: number): string {
	if (score >= 90) return 'Outstanding';
	if (score >= 85) return 'Excellent';
	if (score >= 80) return 'Specialty';
	return 'Below specialty';
}

/** The notes named most often across attributes, most frequent first. */
export function topNotes(
	descriptions: Record<DescribedAttribute, Description>,
	count = 3
): string[] {
	const tally = new Map<string, number>();
	for (const key of DESCRIBED_ATTRIBUTES) {
		for (const note of descriptions[key].notes) {
			const n = note.trim().toLowerCase();
			if (n) tally.set(n, (tally.get(n) ?? 0) + 1);
		}
	}
	return [...tally.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, count)
		.map(([note]) => note);
}
