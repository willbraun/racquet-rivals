import { render, screen } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import PageSetup from '$lib/components/PageSetup.test.svelte'
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
