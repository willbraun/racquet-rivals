import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Page from './+page.svelte'

describe('About page component', () => {
	test('Renders', () => {
		render(PageSetup, {
			props: {
				component: Page
			}
		})

		expect(screen.getByText('About Racquet Rivals')).toBeInTheDocument()
	})
})
