export type VersionScheme = 'chronver' | 'semver';

export interface ProjectMarkInput {
	/** Past stage 2 (Fit) of the experiment levels: marked `G`, otherwise `E`. */
	isGreenlit: boolean;
	project: number;
	version: string;
	scheme: VersionScheme;
}

/** `YYYY.M.D`, then an optional same-day `.N` and `-feature` or `-break` suffix. */
const CHRONVER = /^(\d{4})\.(\d{1,2})\.(\d{1,2})(?:\.(\d+))?(?:-(?:feature|break))?$/;

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
	const [, year, month, day] = match;
	return `${year.slice(2)}${month.padStart(2, '0')}${day.padStart(2, '0')}A`;
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
