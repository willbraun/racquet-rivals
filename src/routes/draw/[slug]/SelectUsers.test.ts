import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SelectUsersTest from './SelectUsers.test.svelte'

describe('SelectUsers component', () => {
	test('Renders', () => {
		render(SelectUsersTest)

		expect(screen.getByText('Select Users')).toBeInTheDocument()
		expect(screen.getByText('will')).toBeInTheDocument()
	})
})
