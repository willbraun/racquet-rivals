import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Layout from './+layout.svelte'

describe('Root layout component', () => {
	test('Renders', () => {
		render(Layout)

		expect(screen.getByText('Will Braun')).toBeInTheDocument()
	})
})
