import PageSetup from '$lib/components/PageSetup.test.svelte'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import Layout from './+layout.svelte'

describe('Rankings layout component', () => {
	test('Renders', () => {
		render(PageSetup, {
			props: {
				component: Layout
			}
		})

		expect(screen.getByText('Rankings')).toBeInTheDocument()
	})
})
