import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import Page from './+page.svelte'

describe('Create account component', () => {
	test('Renders', () => {
		render(Page)

		expect(screen.getAllByText('Create Account').length).toBe(2)
	})

	test('Renders, check if button is enabled', async () => {
		render(Page)

		const user = userEvent.setup()
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
		await user.type(username, 'username')
		expect(button).toBeDisabled()
		await user.type(email, 'test@email.com')
		expect(button).toBeDisabled()
		await user.type(password, '7chars7')
		expect(button).toBeDisabled()
		await user.type(password, 'moreThan8Chars')
		expect(button).toBeEnabled()
		await user.clear(username)
		expect(button).toBeDisabled()
	})

	test('Filled honeypot shows error message on submit', async () => {
		render(Page)

		const user = userEvent.setup()
		const username = screen.getByTestId('UsernameField')
		const email = screen.getByTestId('EmailField')
		const password = screen.getByTestId('PasswordField')
		const honeypot = document.querySelector('input[name="nickname"]') as HTMLInputElement
		const button = screen.getByTestId('CreateAccountButton')

		await user.type(username, 'username')
		await user.type(email, 'test@email.com')
		await user.type(password, 'validpassword')
		await user.type(honeypot, 'bot-fill')

		await user.click(button)

		expect(screen.getByText('Something went wrong, please try again')).toBeInTheDocument()
	})

	test('Invalid email shows inline validation error and disables button', async () => {
		render(Page)

		const user = userEvent.setup()
		const username = screen.getByTestId('UsernameField')
		const email = screen.getByTestId('EmailField')
		const password = screen.getByTestId('PasswordField')
		const button = screen.getByTestId('CreateAccountButton')

		await user.type(username, 'username')
		await user.type(email, 'notanemail')
		await user.tab()
		await user.type(password, 'validpassword')

		expect(screen.getByTestId('EmailFieldError')).toBeVisible()
		expect(button).toBeDisabled()
	})
})
