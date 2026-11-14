export type VersionScheme = 'chronver' | 'semver';

export interface ProjectMarkInput {
	/** Past stage 2 (Fit) of the experiment levels: marked `G`, otherwise `E`. */
	isGreenlit: boolean;
	project: number;
	version: string;
	scheme: VersionScheme;
}

/**
 * `YYYY.M.D`, then an optional same-day `.N` and `-feature` or `-break` suffix.
 * No leading zeros, as `pnpm version` writes them, so `.0` can't collide with
 * the bare version.
 */
const CHRONVER = /^(\d{4})\.([1-9]\d?)\.([1-9]\d?)(?:\.([1-9]\d*))?(?:-(?:feature|break))?$/;

/**
 * Builds a release mark such as `DW/G3-MK261113A`: dot work, greenlit or
 * experiment plus project number, then the release. Throws on a version it
 * can't encode rather than rendering a mark that points at no release.
 */
export function formatProjectMark({
	isGreenlit,
	project,
	version,
	scheme
}: ProjectMarkInput): string {
	const kind = isGreenlit ? 'G' : 'E';
	return `DW/${kind}${project}-MK${formatRelease(version, scheme)}`;
}

function formatRelease(version: string, scheme: VersionScheme): string {
	const match = CHRONVER.exec(version);
	if (!match) {
		throw new Error(`ProjectMark can't read version "${version}" as ${scheme}.`);
	}
	const [, year, month, day, sameDaySuffix] = match;
	// The bare version is the day's first cut; `.N` is cut N + 1.
	const cut = sameDaySuffix === undefined ? 1 : Number(sameDaySuffix) + 1;
	if (cut > MAX_CUTS_PER_DAY) {
		throw new Error(
			`ProjectMark can't letter version "${version}": the mark runs out at ZZ, cut ${MAX_CUTS_PER_DAY} of a day.`
		);
	}
	return `${year.slice(2)}${month.padStart(2, '0')}${day.padStart(2, '0')}${cutLetters(cut)}`;
}

/** `A`–`Z`, then `AA`–`ZZ`. */
const MAX_CUTS_PER_DAY = 26 + 26 * 26;

/** Counts like spreadsheet columns: 1 → `A`, 26 → `Z`, 27 → `AA`, 702 → `ZZ`. */
function cutLetters(cut: number): string {
	const first = Math.floor((cut - 1) / 26);
	const last = (cut - 1) % 26;
	const letter = (index: number) => String.fromCharCode('A'.charCodeAt(0) + index);
	return (first === 0 ? '' : letter(first - 1)) + letter(last);
}

/**
 * Reads `package.json#suede.versioning`. A missing field means chronver,
 * suede's default: forks record their scheme at creation, and suede's own
 * manifest has none.
 */
export function schemeFromManifest(versioning: string | undefined): VersionScheme {
	if (versioning === undefined || versioning === 'chronver') return 'chronver';
	if (versioning === 'semver') return 'semver';
	throw new Error(
		`package.json#suede.versioning is "${versioning}"; ProjectMark expects "chronver" or "semver".`
	);
}
