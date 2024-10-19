import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import PageSetup from './PageSetup.test.svelte'
import NavMenu from './NavMenu.svelte'

describe('NavMenu component', () => {
	test('Renders', () => {
		render(PageSetup, { component: NavMenu })

		expect(screen.getByTestId('hamburger-icon')).toBeInTheDocument()
	})
})
