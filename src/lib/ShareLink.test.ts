import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { isMobile } from './store'
import ShareLinkSetup from './testing/components/ShareLinkSetup.svelte'

describe('SelectUsers component', () => {
	test('Renders if mobile', () => {
		isMobile.set(true)
		render(ShareLinkSetup)
		expect(screen.getByTestId('share-link-icon')).toBeInTheDocument()
	})

	test('Does not render if not mobile', () => {
		isMobile.set(false)
		render(ShareLinkSetup)
		expect(screen.queryByTestId('share-link-icon')).not.toBeInTheDocument()
	})
})
