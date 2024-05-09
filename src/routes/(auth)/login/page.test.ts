import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Page from './+page.svelte'

describe('Login page component', () => {
	test('Renders', () => {
		render(Page)

		expect(screen.getByText('Login')).toBeInTheDocument()
	})
})
