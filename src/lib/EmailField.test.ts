import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import EmailField from './EmailField.svelte'
import userEvent from '@testing-library/user-event'

describe('EmailField component', () => {
	test('Renders', () => {
		render(EmailField)

		expect(screen.getByText('Email')).toBeInTheDocument()
	})

	test('Valid email, error does not show', async () => {
		render(EmailField)

		const email = screen.getByTestId('EmailField')
		const user = userEvent.setup()

		await user.type(email, 'test@example.com')
		await user.tab()
		expect(screen.getByTestId('EmailFieldError')).toHaveClass('invisible')
	})

	test('Invalid email, error shows', async () => {
		render(EmailField)

		const email = screen.getByTestId('EmailField')
		const user = userEvent.setup()

		await user.type(email, 'test')
		await user.tab()
		expect(screen.getByTestId('EmailFieldError')).not.toHaveClass('invisible')
	})
})
