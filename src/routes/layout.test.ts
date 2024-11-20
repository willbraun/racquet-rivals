import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Layout from './+layout.svelte'
import type { RootLayoutData } from '$lib/types'

const data: RootLayoutData = {
	pb_auth_valid: true,
	pb_auth_cookie: 'dummy_cookie',
	pb_auth_username: 'will'
}

describe('Root layout component', () => {
	test('Renders logged in', () => {
		render(Layout, { data })

		expect(screen.getByTestId('Footer')).toBeInTheDocument()
	})

	test('Renders logged out', () => {
		render(Layout, { data: { ...data, pb_auth_valid: false } })

		expect(screen.getByTestId('Footer')).toBeInTheDocument()
	})
})
