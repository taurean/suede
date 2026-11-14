<!--
@component
Renders the project's release mark, such as `DW/G3-MK261113A`. Version and
scheme default to `package.json`; pass them to pin a mark. Throws on a version
it can't encode.
-->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import * as manifest from '../../../../package.json';
	import { formatProjectMark, schemeFromManifest, type VersionScheme } from './project-mark';

	// Suede's own manifest has no `suede` field, so it isn't in the inferred
	// type; forks get one from `pnpm create suede`. Read fields by member
	// access only: destructuring the namespace ships the whole manifest,
	// dependency list included, to the client.
	const manifestVersioning = (manifest as { suede?: { versioning?: string } }).suede?.versioning;

	interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
		/** Past stage 2 (Fit) of the experiment levels: marked `G`, otherwise `E`. */
		isGreenlit: boolean;
		project: number;
		version?: string;
		scheme?: VersionScheme;
	}

	const {
		isGreenlit,
		project,
		version = manifest.version,
		scheme = schemeFromManifest(manifestVersioning),
		...rest
	}: Props = $props();

	const mark = $derived(formatProjectMark({ isGreenlit, project, version, scheme }));
</script>

<span {...rest}>{mark}</span>
