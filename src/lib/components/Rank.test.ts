import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import PageSetup from './PageSetup.test.svelte'
import Rank from './Rank.svelte'

describe('Rank component', () => {
	test('Renders gold medal', () => {
		render(Rank, {
			rank: 1,
			containerStyle: '',
			textStyle: ''
		})

		expect(screen.getByTestId('gold-medal')).toBeInTheDocument()
	})
	test('Renders silver medal', () => {
		render(Rank, {
			rank: 2,
			containerStyle: '',
			textStyle: ''
		})

		expect(screen.getByTestId('silver-medal')).toBeInTheDocument()
	})
	test('Renders bronze medal', () => {
		render(Rank, {
			rank: 3,
			containerStyle: '',
			textStyle: ''
		})

		expect(screen.getByTestId('bronze-medal')).toBeInTheDocument()
	})
	test('Renders outside top 3', () => {
		render(Rank, {
			rank: 4,
			containerStyle: '',
			textStyle: ''
		})

		expect(screen.getByText('4')).toBeInTheDocument()
	})
})
