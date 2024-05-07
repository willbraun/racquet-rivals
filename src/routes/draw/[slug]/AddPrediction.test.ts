import { render, screen } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import AddPrediction from './AddPrediction.svelte'
import type { Prediction, Slot } from '$lib/types'
import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
import { storePopup } from '@skeletonlabs/skeleton'

storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

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
	roundIndex: 1,
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
	test('Renders', () => {
		render(AddPrediction, props)

		expect(screen.getByText('Federer')).toHaveTextContent('Federer')
	})

	test('Predictions allowed, prediction empty, players available', () => {
		render(AddPrediction, {
			...props,
			prediction: undefined
		})

		const buttons = screen.getAllByRole('button')
		expect(buttons.length).toBe(3)
		buttons.forEach((button) => expect(button).toBeEnabled())

		const [prediction, player1, player2] = buttons
		expect(prediction).toHaveTextContent('Add')
		expect(player1).toHaveTextContent('Roger Federer')
		expect(player2).toHaveTextContent('Rafael Nadal')
	})

	test('Predictions allowed, prediction filled', () => {
		render(AddPrediction, props)

		const buttons = screen.getAllByRole('button')
		expect(buttons.length).toBe(3)
		buttons.forEach((button) => expect(button).toBeEnabled())

		const [prediction, player1, player2] = buttons
		expect(prediction).toHaveTextContent('Federer')
		expect(player1).toHaveTextContent('Roger Federer')
		expect(player2).toHaveTextContent('Rafael Nadal')
	})

	test('Predictions allowed, players unavailable, roundIndex 1', () => {
		render(AddPrediction, {
			...props,
			roundIndex: 1,
			players: ['', ''] as [string, string],
			prediction: {
				...props.prediction,
				name: ''
			}
		})

		const buttons = screen.getAllByRole('button')
		expect(buttons.length).toBe(3)

		const [prediction, player1, player2] = buttons
		expect(prediction).toBeEnabled()
		expect(prediction).toHaveTextContent('')
		expect(player1).toBeDisabled()
		expect(player1).toHaveTextContent('Awaiting previous round')
		expect(player2).toBeDisabled()
		expect(player2).toHaveTextContent('Awaiting previous round')
	})

	test('Predictions allowed, players unavailable, roundIndex 2', () => {
		render(AddPrediction, {
			...props,
			roundIndex: 2,
			players: ['', ''] as [string, string],
			prediction: {
				...props.prediction,
				name: ''
			}
		})

		const buttons = screen.getAllByRole('button')
		expect(buttons.length).toBe(3)

		const [prediction, player1, player2] = buttons
		expect(prediction).toBeEnabled()
		expect(prediction).toHaveTextContent('')
		expect(player1).toBeDisabled()
		expect(player1).toHaveTextContent('Predict previous round')
		expect(player2).toBeDisabled()
		expect(player2).toHaveTextContent('Predict previous round')
	})

	test('Predictions allowed, invalid roundIndex', () => {
		render(AddPrediction, {
			...props,
			roundIndex: 0,
			players: ['', ''] as [string, string],
			prediction: {
				...props.prediction,
				name: ''
			}
		})

		const buttons = screen.getAllByRole('button')
		expect(buttons.length).toBe(3)

		const [prediction, player1, player2] = buttons
		expect(prediction).toBeEnabled()
		expect(prediction).toHaveTextContent('')
		expect(player1).toBeDisabled()
		expect(player1).toHaveTextContent('Invalid round index')
		expect(player2).toBeDisabled()
		expect(player2).toHaveTextContent('Invalid round index')
	})

	test('Predictions not allowed, prediction filled', () => {
		render(AddPrediction, {
			...props,
			predictionsAllowed: false
		})

		const buttons = screen.getAllByRole('button')
		expect(buttons.length).toBe(3)
		buttons.forEach((button) => expect(button).toBeDisabled())

		const [prediction, player1, player2] = buttons
		expect(prediction).toHaveTextContent('Federer')
		expect(player1).toHaveTextContent('Roger Federer')
		expect(player2).toHaveTextContent('Rafael Nadal')
	})

	test('Predictions not allowed, prediction empty', () => {
		render(AddPrediction, {
			...props,
			predictionsAllowed: false,
			prediction: undefined
		})

		expect(screen.getByText('None')).toHaveTextContent('None')
	})
})
