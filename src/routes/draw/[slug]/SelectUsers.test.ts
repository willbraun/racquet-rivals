import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SelectUsers from './SelectUsers.svelte'

describe('SelectUsers component', () => {
	test('Renders', () => {
		render(SelectUsers)

		expect(screen.getByText('Select Users')).toBeInTheDocument()
	})
})
