import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import HowToPlayTest from './HowToPlay.test.svelte'

describe('SelectUsers component', () => {
	test('Renders', () => {
		render(HowToPlayTest)

		expect(screen.getByText('How to Play')).toBeInTheDocument()
	})
})
