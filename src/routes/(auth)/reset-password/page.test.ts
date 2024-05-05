import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import page from './+page.svelte'

describe('Reset Password page component', () => {
	test('Renders', () => {
		render(page)

		expect(screen.getByText('Reset Password')).toBeInTheDocument()
	})
})
