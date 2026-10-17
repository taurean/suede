<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DynamicText from '#lib/components/ui/DynamicText.svelte';
	import SuedeButton from '#lib/components/ui/SuedeButton.svelte';

	const { Story } = defineMeta({
		title: 'UI/DynamicText',
		component: DynamicText,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: `
Animates its text letter by letter whenever the \`text\` prop changes, and announces the change to assistive tech through a polite live region (\`announce={false}\` opts out).

**Wrap it in an element that carries the styles.** DynamicText renders a bare span that inherits its typography, so put font, size, weight, colour, and letter-spacing on the wrapper:

\`\`\`svelte
<h2 class="u:fs-5">
  <DynamicText text={title} />
</h2>
\`\`\`

Put backgrounds, borders, and padding on the wrapper too. The span has 0.5em of padding, cancelled by a matching negative margin, so blurred letters aren't clipped; a box drawn on the span itself would extend past the text.

Each letter is its own inline-block, so underline and strikethrough, gradient text, kerning between letters, wrapping, and truncation don't apply.
`
				}
			}
		},
		args: {
			text: 'New chat',
			announce: true
		},
		argTypes: {
			text: { control: 'text' },
			announce: { control: 'boolean' }
		}
	});
</script>

<script lang="ts">
	const samples = ['New chat', 'Suede design system principles'];
	let sampleIndex = $state(0);

	function swapText() {
		sampleIndex = (sampleIndex + 1) % samples.length;
	}
</script>

<Story name="Default" />

<Story name="Swap" asChild>
	<p class="u:fs-3">
		<DynamicText text={samples[sampleIndex]} />
	</p>
	<SuedeButton onclick={swapText}>Swap text</SuedeButton>
</Story>

<Story name="Swap, not announced" asChild>
	<p class="u:fs-3">
		<DynamicText text={samples[sampleIndex]} announce={false} />
	</p>
	<SuedeButton onclick={swapText}>Swap text</SuedeButton>
</Story>

<Story name="Styled wrapper" asChild>
	<h2 class="u:fs-5" style="font-weight: 600; color: var(--hue-blue-600);">
		<DynamicText text={samples[sampleIndex]} />
	</h2>
	<SuedeButton onclick={swapText}>Swap text</SuedeButton>
</Story>

<Story name="Large type" asChild>
	<p class="u:fs-8">
		<DynamicText text={samples[sampleIndex]} />
	</p>
	<SuedeButton onclick={swapText}>Swap text</SuedeButton>
</Story>
