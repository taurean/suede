import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { Snippet } from 'svelte';
import Accordion from './Accordion.svelte';

const text = (value: string): Snippet =>
	createRawSnippet(() => ({
		render: () => `<p>${value}</p>`
	}));

describe('Accordion.svelte', () => {
	const items = [
		{ value: 'item-1', title: 'Section 1', content: text('First content') },
		{ value: 'item-2', title: 'Section 2', content: text('Second content') }
	];

	it('renders each item as a trigger', async () => {
		render(Accordion, { items, type: 'single' });

		await expect.element(page.getByRole('button', { name: 'Section 1' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Section 2' })).toBeInTheDocument();
	});

	it('reveals content when a trigger is clicked', async () => {
		render(Accordion, { items, type: 'single' });

		await page.getByRole('button', { name: 'Section 1' }).click();
		await expect.element(page.getByText('First content')).toBeVisible();
	});
});
