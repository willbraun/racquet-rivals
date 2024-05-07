import { render, screen } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import AddPrediction from './AddPrediction.svelte'
import type { Prediction, Slot } from '$lib/types'

const props = {
	slot: {
		collectionId: 'collectionId',
		collectionName: 'draw_slot',
		created: '',
		draw_id: 'drawId',
		id: 'slotId',
		name: '',
		position: 1,
		round: 3,
		seed: '',
		updated: ''
	} as Slot,
	roundIndex: 0,
	players: ['Roger Federer', 'Rafael Nadal'] as [string, string],
	prediction: {
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
	} as Prediction,
	predictionsAllowed: true,
	getColor: vi.fn()
}

describe('AddPrediction component', () => {
	// button is clickable, predictionsAllowed

	// displayPrediction
	// player 1 present vs undefined, in roundIndex 0 vs above
	// player 2 present vs undefined, in roundIndex 0 vs above
	// simulate a click on the add prediction button and then check for the values in the buttons in the popup

	test('Roger Federer', () => {
		render(AddPrediction, props)

		expect(screen.getByText('Federer')).toHaveTextContent('Federer')
	})
})
