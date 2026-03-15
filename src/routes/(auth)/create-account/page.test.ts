import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Page from './+page.svelte'

let turnstileErrorCallback: ((errorCode: number) => void) | undefined

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

	test('Shows error and resets widget for error family 100 (initialization error)', async () => {
		render(Page)
		turnstileErrorCallback?.(100001)

		await waitFor(() => {
			expect(screen.getByText('Please refresh the page and try again.')).toBeInTheDocument()
		})
		expect(screen.getByTestId('CreateAccountButton')).toBeDisabled()
		expect(window.turnstile.reset).toHaveBeenCalledWith('fake-widget-id')
	})

	test('Shows error and does NOT reset widget for error family 110 (configuration error)', async () => {
		render(Page)
		turnstileErrorCallback?.(110200)

		await waitFor(() => {
			expect(screen.getByText('Configuration error. Please contact support.')).toBeInTheDocument()
		})
		expect(screen.getByTestId('CreateAccountButton')).toBeDisabled()
		expect(window.turnstile.reset).not.toHaveBeenCalled()
	})

	test('Shows error and resets widget for error family 300 (security error)', async () => {
		render(Page)
		turnstileErrorCallback?.(300030)

		await waitFor(() => {
			expect(
				screen.getByText(
					'Security check failed. Please try refreshing or using a different browser.'
				)
			).toBeInTheDocument()
		})
		expect(screen.getByTestId('CreateAccountButton')).toBeDisabled()
		expect(window.turnstile.reset).toHaveBeenCalledWith('fake-widget-id')
	})

	test('Shows error and resets widget for error family 600 (security error)', async () => {
		render(Page)
		turnstileErrorCallback?.(600010)

		await waitFor(() => {
			expect(
				screen.getByText(
					'Security check failed. Please try refreshing or using a different browser.'
				)
			).toBeInTheDocument()
		})
		expect(screen.getByTestId('CreateAccountButton')).toBeDisabled()
		expect(window.turnstile.reset).toHaveBeenCalledWith('fake-widget-id')
	})

	test('Shows generic error and resets widget for unknown error codes', async () => {
		render(Page)
		turnstileErrorCallback?.(999999)

		await waitFor(() => {
			expect(
				screen.getByText('An unexpected error occurred. Please try again.')
			).toBeInTheDocument()
		})
		expect(screen.getByTestId('CreateAccountButton')).toBeDisabled()
		expect(window.turnstile.reset).toHaveBeenCalledWith('fake-widget-id')
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
