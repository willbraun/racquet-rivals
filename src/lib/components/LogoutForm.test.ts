import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import LogoutFormTest from './LogoutForm.test.svelte'

describe('Logout component', () => {
	test('Renders', () => {
		render(LogoutFormTest)

		const button = screen.getByRole('button')
		const text = screen.queryByText(/Logout/u)

		expect(button).toBeInTheDocument()
		expect(text).toBeInTheDocument()
	})
})
