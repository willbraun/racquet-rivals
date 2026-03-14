import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import Page from './+page.svelte'

describe('Login page component', () => {
	test('Renders', () => {
		render(Page)

		expect(screen.getByText('Login')).toBeInTheDocument()
	})

	test('Shows error when honeypot field is filled', async () => {
		render(Page)
		const user = userEvent.setup()

		// Fill all visible fields so they pass validation
		await user.type(screen.getByTestId('UsernameOrEmailField'), 'username')
		await user.type(screen.getByTestId('PasswordField'), 'password123')

		// Fill the honeypot (query by name since it's aria-hidden)
		const honeypotInput = document.querySelector('input[name="nickname"]') as HTMLInputElement
		await user.type(honeypotInput, 'bot fill')

		const button = screen.getByTestId('LoginButton')
		await user.click(button)

		expect(await screen.findByText(/Something went wrong, please try again/)).toBeInTheDocument()
	})

	test('Shows error when username or email is empty on submit', async () => {
		render(Page)

		const user = userEvent.setup()
		await user.type(screen.getByTestId('PasswordField'), 'password123')
		await user.click(screen.getByTestId('LoginButton'))

		expect(screen.getByText('Please enter your username or email')).toBeInTheDocument()
	})

	test('Shows error when password is empty on submit', async () => {
		render(Page)

		const user = userEvent.setup()
		await user.type(screen.getByTestId('UsernameOrEmailField'), 'username')
		await user.click(screen.getByTestId('LoginButton'))

		expect(screen.getByText('Please enter your password')).toBeInTheDocument()
	})

	test('Shows both errors when all fields are empty on submit', async () => {
		render(Page)

		const user = userEvent.setup()
		await user.click(screen.getByTestId('LoginButton'))

		expect(screen.getByText(/Please enter your username or email/)).toBeInTheDocument()
		expect(screen.getByText(/Please enter your password/)).toBeInTheDocument()
	})
})
