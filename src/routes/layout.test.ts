import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import layout from './+layout.svelte'

describe('Root layout component', () => {
	test('Renders', () => {
		render(layout)

		expect(screen.getByText('Will Braun')).toBeInTheDocument()
	})
})
