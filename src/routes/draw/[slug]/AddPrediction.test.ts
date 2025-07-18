import { pb } from '$lib/pocketbase'
import { currentUser, predictionStore } from '$lib/store'
import type { Prediction, Slot, UserRecord } from '$lib/types'
import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { storePopup } from '@skeletonlabs/skeleton'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { get } from 'svelte/store'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import AddPrediction from './AddPrediction.svelte'

storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

// Mock PocketBase
vi.mock('$lib/pocketbase', () => ({
	pb: {
		authStore: {
			isValid: true,
			record: {
				id: 'testUserId',
				username: 'testUser'
			}
		},
		collection: vi.fn(() => ({
			create: vi.fn(),
			update: vi.fn()
		}))
	}
}))

const props = {
	slot: {
		collectionId: 'collectionId',
		collectionName: 'slots_with_scores',
		created: '',
		draw_id: 'drawId',
		id: 'slotId',
		name: '',
		position: 1,
		round: 3,
		seed: '',
		updated: '',
		set1_id: 'set1',
		set1_games: 6,
		set1_tiebreak: 0,
		set2_id: 'set2',
		set2_games: 7,
		set2_tiebreak: 0,
		set3_id: 'set3',
		set3_games: 6,
		set3_tiebreak: 0,
		set4_id: null,
		set4_games: null,
		set4_tiebreak: null,
		set5_id: null,
		set5_games: null,
		set5_tiebreak: null
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

const userWill = {
	collectionId: '_pb_users_auth_',
	collectionName: 'user',
	avatar: '',
	id: 'willId',
	username: 'will',
	emailVisibility: true,
	created: '2024-05-02 15:42:20.397Z',
	updated: '2024-05-02 15:42:20.397Z'
} as UserRecord

describe('AddPrediction component', () => {
	let mockCollection: any

	beforeEach(() => {
		vi.clearAllMocks()

		// Reset the real store before each test
		predictionStore.set([])
		currentUser.set(userWill)

		// Create mock collection with methods
		mockCollection = {
			create: vi.fn(),
			update: vi.fn()
		}

		// Setup PocketBase mock to return our mock collection
		vi.mocked(pb.collection).mockReturnValue(mockCollection)
	})

	afterEach(() => {
		vi.clearAllMocks()
		predictionStore.set([])
	})

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

	test('Add new prediction', async () => {
		const user = userEvent.setup()
		render(AddPrediction, {
			...props,
			prediction: undefined
		})

		const mockCreatedPrediction = {
			id: 'newPredictionId',
			draw_id: 'drawId',
			draw_slot_id: 'slotId',
			name: 'Roger Federer',
			user_id: 'testUserId'
		}
		mockCollection.create.mockResolvedValue(mockCreatedPrediction)

		expect(get(predictionStore)).toHaveLength(0)

		const [addButton, rogerButton, rafaButton] = screen.getAllByRole('button')
		expect(addButton).toHaveTextContent('Add')
		expect(rogerButton).toHaveTextContent('Roger Federer')
		expect(rafaButton).toHaveTextContent('Rafael Nadal')

		await user.click(rogerButton)
		await vi.waitFor(() => {
			expect(mockCollection.create).toHaveBeenCalledOnce()
			expect(mockCollection.update).not.toHaveBeenCalled()
		})

		const predictions = get(predictionStore)
		expect(predictions).toHaveLength(1)
		expect(predictions[0]).toMatchObject({
			id: 'newPredictionId',
			name: 'Roger Federer',
			draw_id: 'drawId',
			position: 1,
			round: 3
		})

		expect(addButton).toHaveTextContent('Federer')
	})

	test('Update existing prediction', async () => {
		const user = userEvent.setup()
		render(AddPrediction, props)

		const mockUpdatedPrediction = {
			...props.prediction,
			name: 'Rafael Nadal'
		}
		mockCollection.update.mockResolvedValue(mockUpdatedPrediction)

		expect(get(predictionStore)).toHaveLength(0)

		const [addButton, rogerButton, rafaButton] = screen.getAllByRole('button')
		expect(addButton).toHaveTextContent('Federer')
		expect(rogerButton).toHaveTextContent('Roger Federer')
		expect(rafaButton).toHaveTextContent('Rafael Nadal')

		await user.click(rafaButton)
		await vi.waitFor(() => {
			expect(mockCollection.update).toHaveBeenCalledOnce()
			expect(mockCollection.create).not.toHaveBeenCalled()
		})

		const predictions = get(predictionStore)
		expect(predictions).toHaveLength(1)
		expect(predictions[0]).toMatchObject({
			id: 'predictionId',
			name: 'Rafael Nadal',
			draw_id: 'drawId',
			position: 1,
			round: 3
		})

		expect(addButton).toHaveTextContent('Nadal')
	})

	test('Logged out', () => {
		currentUser.set(null)
		render(AddPrediction, {
			...props
		})

		const [addButton, rogerButton, rafaButton] = screen.getAllByRole('button')
		expect(addButton).toBeDisabled()
		expect(rogerButton).toBeDisabled()
		expect(rafaButton).toBeDisabled()
	})
})
