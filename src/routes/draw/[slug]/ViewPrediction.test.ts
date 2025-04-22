import { render, screen } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import ViewPrediction from './ViewPrediction.svelte'
import type { Prediction } from '$lib/types'

const prediction = {
	collectionId: 'collectionId',
	collectionName: 'view_predictions',
	draw_id: 'drawId',
	draw_slot_id: 'drawSlotId',
	round: 3,
	position: 1,
	seed: '',
	id: 'predictionId',
	name: 'Roger Federer',
	points: 0,
	user_id: 'userId',
	username: 'John'
} as Prediction

describe('ViewPrediction component', () => {
	test('Roger Federer', () => {
		render(ViewPrediction, {
			prediction
		})

		expect(screen.getByText('Federer')).toHaveTextContent('Federer')
	})

	test('Alex de Minaur', () => {
		render(ViewPrediction, {
			prediction: {
				...prediction,
				name: 'Alex de Minaur'
			}
		})

		expect(screen.getByText('de Minaur')).toHaveTextContent('de Minaur')
	})
})
