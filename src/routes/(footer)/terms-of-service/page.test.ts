import { render, screen } from '@testing-library/svelte'
import { describe, test, expect } from 'vitest'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Page from './+page.svelte'

describe('Terms of Service page', () => {
	test('renders the terms of service page', () => {
		render(PageSetup, {
			props: {
				component: Page
			}
		})
		expect(screen.getByText('Terms of Service')).toBeInTheDocument()
	})
})
