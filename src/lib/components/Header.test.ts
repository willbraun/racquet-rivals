import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Header from './Header.svelte'

describe('Header component', () => {
	test('Renders', () => {
		render(PageSetup, {
			props: {
				component: Header
			}
		})

		expect(screen.getByTestId('home-icon')).toBeInTheDocument()
	})
})
