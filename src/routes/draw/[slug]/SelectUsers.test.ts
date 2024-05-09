import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SelectUsersWrapper from '$lib/testing/components/SelectUsersWrapper.svelte'

describe('SelectUsers component', () => {
	test('Renders', () => {
		render(SelectUsersWrapper)

		expect(screen.getByText('Select Users')).toBeInTheDocument()
		expect(screen.getByText('will')).toBeInTheDocument()
		expect(screen.getByText('john')).toBeInTheDocument()
		expect(screen.getByText('sally')).toBeInTheDocument()
	})
})
