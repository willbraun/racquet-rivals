import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import DrawPricingContent from './DrawPricingContent.svelte'
import { Events, type Draw } from '$lib/types'

const mensDraw: Draw = {
	id: 'mens-draw-id',
	name: 'French Open',
	year: 2024,
	event: Events.MENS_SINGLES,
	start_date: '2024-05-26T00:00:00.000Z',
	end_date: '2024-06-09T00:00:00.000Z',
	collectionId: '',
	collectionName: 'draw',
	created: '',
	updated: '',
	prediction_close: '',
	size: 128,
	url: ''
}

const womensDraw: Draw = {
	id: 'womens-draw-id',
	name: 'French Open',
	year: 2024,
	event: Events.WOMENS_SINGLES,
	start_date: '2024-05-26T00:00:00.000Z',
	end_date: '2024-06-09T00:00:00.000Z',
	collectionId: '',
	collectionName: 'draw',
	created: '',
	updated: '',
	prediction_close: '',
	size: 128,
	url: ''
}

describe('DrawPricingContent', () => {
	test("Renders three pricing options for men's draw", () => {
		render(DrawPricingContent, {
			props: {
				draw: mensDraw,
				mensDraw,
				womensDraw,
				onClose: () => {}
			}
		})

		// Single draw option
		expect(screen.getByText(/French Open 2024 Men's Draw/)).toBeInTheDocument()
		expect(screen.getByText(/Play the men's draw/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '$4.99' })).toBeInTheDocument()

		// Bundle option
		expect(screen.getByText(/Men's \+ Women's Bundle/)).toBeInTheDocument()
		expect(screen.getByText(/Play both draws/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '$7.99' })).toBeInTheDocument()

		// Subscription option
		expect(screen.getByText(/Annual Subscription/)).toBeInTheDocument()
		expect(
			screen.getByText(/Play all men's and women's draws for a full year/i)
		).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '$19.99' })).toBeInTheDocument()
	})

	test("Renders three pricing options for women's draw", () => {
		render(DrawPricingContent, {
			props: {
				draw: womensDraw,
				mensDraw,
				womensDraw,
				onClose: () => {}
			}
		})

		// Single draw option
		expect(screen.getByText(/French Open 2024 Women's Draw/)).toBeInTheDocument()
		expect(screen.getByText(/Play the women's draw/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '$4.99' })).toBeInTheDocument()

		// Bundle option
		expect(screen.getByText(/Women's \+ Men's Bundle/)).toBeInTheDocument()
		expect(screen.getByText(/Play both draws/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '$7.99' })).toBeInTheDocument()

		// Subscription option
		expect(screen.getByText(/Annual Subscription/)).toBeInTheDocument()
		expect(
			screen.getByText(/Play all men's and women's draws for a full year/i)
		).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '$19.99' })).toBeInTheDocument()
	})
})
