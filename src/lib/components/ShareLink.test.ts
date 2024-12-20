import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { isMobile } from '../store'
import PageSetup from './PageSetup.test.svelte'
import ShareLink from './ShareLink.svelte'

describe('SelectUsers component', () => {
	test('Renders if mobile', () => {
		isMobile.set(true)
		render(PageSetup, { props: { component: ShareLink } })
		expect(screen.getByTestId('share-link-icon')).toBeInTheDocument()
	})

	test('Does not render if not mobile', () => {
		isMobile.set(false)
		render(PageSetup, { props: { component: ShareLink } })
		expect(screen.queryByTestId('share-link-icon')).not.toBeInTheDocument()
	})
})
