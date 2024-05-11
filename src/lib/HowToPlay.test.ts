import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import HowToPlaySetup from './testing/components/HowToPlaySetup.svelte'

describe('SelectUsers component', () => {
	test('Renders', () => {
		render(HowToPlaySetup)

		expect(screen.getByText('How to Play')).toBeInTheDocument()
	})
})
