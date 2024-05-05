import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import page from './+page.svelte'
import userEvent from '@testing-library/user-event'

describe('PasswordField component', () => {
	test('Renders', () => {
		render(page)

		expect(screen.getAllByText('Create Account').length).toBe(2)
	})

	test('Renders, check if button is enabled', async () => {
		render(page)

		const username = screen.getByTestId('UsernameField')
		const email = screen.getByTestId('EmailField')
		const password = screen.getByTestId('PasswordField')
		const button = screen
			.getAllByRole('button')
			.find((button) => button.textContent === 'Create Account')

		expect(username).toBeInTheDocument()
		expect(email).toBeInTheDocument()
		expect(password).toBeInTheDocument()
		expect(button).toBeInTheDocument()

		expect(button).toBeDisabled()
		await userEvent.type(username, 'username')
		expect(button).toBeDisabled()
		await userEvent.type(email, 'test@email.com')
		expect(button).toBeDisabled()
		await userEvent.type(password, '7chars7')
		expect(button).toBeDisabled()
		await userEvent.type(password, 'moreThan8Chars')
		expect(button).toBeEnabled()
		await userEvent.clear(username)
		expect(button).toBeDisabled()
	})
})
