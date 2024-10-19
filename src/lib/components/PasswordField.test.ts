import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import PasswordField from './PasswordField.svelte'

describe('PasswordField component', () => {
	test('Renders', () => {
		render(PasswordField)

		expect(screen.getByText('Password')).toBeInTheDocument()
	})
})
