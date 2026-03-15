import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Page from './+page.svelte'

let turnstileErrorCallback: (() => void) | undefined

beforeEach(() => {
	turnstileErrorCallback = undefined

	window.turnstile = {
		render: vi
			.fn()
			.mockImplementation(
				(_container: string, options: Parameters<Window['turnstile']['render']>[1]) => {
					turnstileErrorCallback = options['error-callback']
					// Simulate Cloudflare resolving the challenge immediately
					options.callback?.('fake-token')
					return 'fake-widget-id'
				}
			),
		remove: vi.fn(),
		reset: vi.fn(),
		getResponse: vi.fn().mockReturnValue('fake-token'),
		isExpired: vi.fn().mockReturnValue(false)
	}
})

describe('Create account component', () => {
	test('Renders', () => {
		render(Page)

		expect(screen.getAllByText('Create Account').length).toBe(2)
	})

	test('Button requires all fields and Turnstile token to be enabled', async () => {
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

		// Turnstile mock fires callback on mount, but empty fields still disable the button
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

	test('Shows error and disables button when Turnstile verification fails', async () => {
		render(Page)

		// Trigger the Cloudflare error callback (e.g. network failure during challenge)
		turnstileErrorCallback?.()

		await waitFor(() => {
			expect(
				screen.getByText('Cloudflare verification error, please try again')
			).toBeInTheDocument()
		})

		const user = userEvent.setup()
		await user.type(screen.getByTestId('UsernameField'), 'username')
		await user.type(screen.getByTestId('EmailField'), 'test@email.com')
		await user.type(screen.getByTestId('PasswordField'), 'validpassword')

		// Button still disabled because token was cleared by the error callback
		expect(screen.getByTestId('CreateAccountButton')).toBeDisabled()
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
