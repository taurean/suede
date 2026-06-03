import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';

const label = (text: string) =>
	createRawSnippet(() => ({
		render: () => `<span>${text}</span>`
	}));

describe('Button.svelte', () => {
	it('renders its children', async () => {
		render(Button, { children: label('Click me') });

		await expect.element(page.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
	});

	it('applies disabled state', async () => {
		render(Button, { children: label('Disabled'), disabled: true });

		const button = page.getByRole('button', { name: 'Disabled' });
		await expect.element(button).toBeDisabled();
	});
});
