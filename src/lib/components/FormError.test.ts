import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import FormError from './FormError.svelte'

describe('FormError component', () => {
	test('Renders with text', () => {
		render(FormError, { error: 'test error' })

		expect(screen.getByText('test error')).toBeInTheDocument()
	})
})
