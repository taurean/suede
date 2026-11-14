export type VersionScheme = 'chronver' | 'semver';

interface ProjectMarkInput {
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

/** `MAJOR.MINOR.PATCH` only; a prerelease or build suffix doesn't fit the mark. */
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

/** `A`–`Z`, then `AA`–`ZZ`. */
const MAX_CUTS_PER_DAY = 26 + 26 * 26;

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
	const release = scheme === 'semver' ? semverRelease(version) : chronverRelease(version);
	return `DW/${kind}${project}-MK${release}`;
}

/** `2.31.6` → `2-31-6`. Semver has no same-day count, so no letter. */
function semverRelease(version: string): string {
	const match = SEMVER.exec(version);
	if (!match) {
		throw new Error(`ProjectMark can't read version "${version}" as semver.`);
	}
	const [, major, minor, patch] = match;
	return `${major}-${minor}-${patch}`;
}

/** `2026.11.13.3` → `261113D`: the date, then a letter for the day's cut. */
function chronverRelease(version: string): string {
	const match = CHRONVER.exec(version);
	if (!match) {
		throw new Error(`ProjectMark can't read version "${version}" as chronver.`);
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
