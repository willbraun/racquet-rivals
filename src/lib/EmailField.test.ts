import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import EmailField from './EmailField.svelte'

const baseClasses = 'text-red-500 text-xs my-0'

describe('EmailField component', () => {
	test('Renders', () => {
		render(EmailField)

		expect(screen.getByText('Email')).toBeInTheDocument()
	})

	test('Renders with valid email, error does not show', () => {
		render(EmailField, { email: 'test@example.com', showValidation: false })

		expect(screen.getByText('Email')).toBeInTheDocument()
		expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
		expect(screen.getByText('Please enter an email address with a valid format')).toHaveClass(
			`${baseClasses} invisible`
		)
	})

	test('Renders with invalid email, error shows', () => {
		render(EmailField, { email: 'test', showValidation: false })

		expect(screen.getByText('Email')).toBeInTheDocument()
		expect(screen.getByDisplayValue('test')).toBeInTheDocument()
		expect(screen.getByText('Please enter an email address with a valid format')).toHaveClass(
			`${baseClasses}`
		)
	})
})
