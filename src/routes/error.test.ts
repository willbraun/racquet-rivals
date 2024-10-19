import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Page from './+error.svelte'

describe('Error page', () => {
	test('Renders', () => {
		render(PageSetup, { component: Page })

		expect(screen.getByText('Error')).toBeInTheDocument()
	})
})
