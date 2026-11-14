import { readdirSync, readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

// `suede-kickoff` only runs in a project `pnpm create suede` just made, so `suede install` never copies it.
const NOT_INSTALLED = ['suede-kickoff'];

it('lists every skill in package.json#suedeInstall exactly once, so suede install copies the ones that exist', () => {
	const { suedeInstall } = JSON.parse(readFileSync('package.json', 'utf8')) as {
		suedeInstall: { process: string[]; css: string[] };
	};
	const listed = [...suedeInstall.process, ...suedeInstall.css, ...NOT_INSTALLED];
	const skills = readdirSync('.claude/skills', { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name);

	expect(listed.toSorted()).toEqual(skills.toSorted());
});
