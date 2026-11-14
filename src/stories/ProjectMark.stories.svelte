<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ProjectMark from '#lib/components/ui/ProjectMark.svelte';

	const { Story } = defineMeta({
		title: 'UI/ProjectMark',
		component: ProjectMark,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: `
Renders a project's release mark: \`DW/\`, then \`G\` for a greenlit project (past Fit) or \`E\` for an experiment, the project number, \`-MK\`, and the release.

A chronver release is \`YYMMDD\` plus a letter for the day's cut: the bare version is \`A\`, \`.1\` is \`B\`, up to \`ZZ\`. A semver release is \`X-Y-Z\` with no letter.

Version and scheme come from \`package.json\` (\`version\` and \`suede.versioning\`, chronver when unset). Pass them to pin a mark. The mark renders as a bare span that inherits its typography.
`
				}
			}
		},
		args: {
			isGreenlit: true,
			project: 3
		},
		argTypes: {
			isGreenlit: { control: 'boolean' },
			project: { control: 'number' },
			version: { control: 'text' },
			scheme: { control: 'inline-radio', options: ['chronver', 'semver'] }
		}
	});
</script>

<Story name="From package.json" />

<Story name="Chronver, first cut" args={{ version: '2026.11.13', scheme: 'chronver' }} />

<Story
	name="Chronver, fourth cut of the day"
	args={{ version: '2026.11.13.3', scheme: 'chronver' }}
/>

<Story
	name="Chronver, last letter of the day"
	args={{ version: '2026.11.13.701', scheme: 'chronver' }}
/>

<Story
	name="Experiment on semver"
	args={{ isGreenlit: false, project: 7, version: '2.31.6', scheme: 'semver' }}
/>
