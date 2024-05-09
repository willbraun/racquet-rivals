import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SelectUsersSetup from '$lib/testing/components/SelectUsersSetup.svelte'

describe('SelectUsers component', () => {
	test('Renders', () => {
		render(SelectUsersSetup)

		expect(screen.getByText('Select Users')).toBeInTheDocument()
		expect(screen.getByText('will')).toBeInTheDocument()
		expect(screen.getByText('john')).toBeInTheDocument()
		expect(screen.getByText('sally')).toBeInTheDocument()
	})
})
