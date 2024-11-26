import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import PrivacyPolicy from './+page.svelte'

describe('PrivacyPolicy Page', () => {
	test('Renders', () => {
		render(PrivacyPolicy)

		expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
	})
})
