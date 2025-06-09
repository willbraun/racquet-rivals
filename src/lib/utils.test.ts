import '@testing-library/jest-dom/vitest'
import { get } from 'svelte/store'
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { currentDrawId, currentUser, predictionStore, selectedUsers } from './store'
import type {
	PbListResponse,
	Prediction,
	SelectedUser,
	UserRecord,
	ViewPredictionRecord
} from './types'
import { addUser, removeUser } from './utils'

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

const userJames = {
	...userWill,
	id: 'jamesId',
	username: 'james'
} as UserRecord

const testSelectedUsers: SelectedUser[] = [
	{
		selectorId: 'willId',
		id: 'userId1',
		username: 'john',
		color: 'bg-red-300'
	},
	{
		selectorId: 'willId',
		id: 'userId2',
		username: 'steve',
		color: 'bg-yellow-300'
	},
	{
		selectorId: 'willId',
		id: 'userId3',
		username: 'sally',
		color: 'bg-green-300'
	},
	{
		selectorId: 'jamesId',
		id: 'userId1',
		username: 'john',
		color: 'bg-red-300'
	}
]

const testPredictions: Prediction[] = [
	{
		collectionId: 'collectionId1',
		collectionName: 'view_predictions',
		draw_id: 'drawId1',
		draw_slot_id: 'drawSlotId1',
		id: 'predictionId1',
		round: 7,
		position: 1,
		seed: '(1)',
		name: 'Sabalenka',
		points: 0,
		user_id: 'userId1',
		username: 'john',
		color: 'bg-red-300'
	},
	{
		collectionId: 'collectionId1',
		collectionName: 'view_predictions',
		draw_id: 'drawId1',
		draw_slot_id: 'drawSlotId2',
		id: 'predictionId2',
		round: 7,
		position: 2,
		seed: '(2)',
		name: 'Swiatek',
		points: 0,
		user_id: 'userId1',
		username: 'john',
		color: 'bg-red-300'
	},
	{
		collectionId: 'collectionId1',
		collectionName: 'view_predictions',
		draw_id: 'drawId1',
		draw_slot_id: 'drawSlotId1',
		id: 'predictionId3',
		round: 7,
		position: 1,
		seed: '(1)',
		name: 'Sabalenka',
		points: 0,
		user_id: 'userId2',
		username: 'steve',
		color: 'bg-yellow-300'
	},
	{
		collectionId: 'collectionId1',
		collectionName: 'view_predictions',
		draw_id: 'drawId1',
		draw_slot_id: 'drawSlotId2',
		id: 'predictionId4',
		round: 7,
		position: 2,
		seed: '(2)',
		name: 'Swiatek',
		points: 0,
		user_id: 'userId2',
		username: 'steve',
		color: 'bg-yellow-300'
	},
	{
		collectionId: 'collectionId1',
		collectionName: 'view_predictions',
		draw_id: 'drawId1',
		draw_slot_id: 'drawSlotId1',
		id: 'predictionId5',
		round: 7,
		position: 1,
		seed: '(1)',
		name: 'Sabalenka',
		points: 0,
		user_id: 'userId3',
		username: 'sally',
		color: 'bg-green-300'
	},
	{
		collectionId: 'collectionId1',
		collectionName: 'view_predictions',
		draw_id: 'drawId1',
		draw_slot_id: 'drawSlotId2',
		id: 'predictionId6',
		round: 7,
		position: 2,
		seed: '(2)',
		name: 'Swiatek',
		points: 0,
		user_id: 'userId3',
		username: 'sally',
		color: 'bg-green-300'
	}
]

const mockViewPredictionRecords = [
	{
		collectionId: 'collectionId1',
		collectionName: 'view_predictions',
		draw_id: 'drawId1',
		draw_slot_id: 'drawSlotId1',
		id: 'predictionId7',
		round: 7,
		position: 1,
		seed: '(1)',
		name: 'Sabalenka',
		points: 0,
		user_id: 'userId4',
		username: 'bob'
	},
	{
		collectionId: 'collectionId1',
		collectionName: 'view_predictions',
		draw_id: 'drawId1',
		draw_slot_id: 'drawSlotId2',
		id: 'predictionId8',
		round: 7,
		position: 2,
		seed: '(2)',
		name: 'Swiatek',
		points: 0,
		user_id: 'userId4',
		username: 'bob'
	}
] as ViewPredictionRecord[]

const mockViewPredictionResponse = {
	items: mockViewPredictionRecords,
	page: 1,
	perPage: 30,
	totalItems: 3,
	totalPages: 1
} as PbListResponse<ViewPredictionRecord>

// Save the original fetch
const originalFetch = global.fetch

beforeAll(() => {
	// Mock the global fetch
	global.fetch = vi.fn().mockResolvedValue({
		json: () => new Promise((resolve) => resolve(mockViewPredictionResponse))
	})
})

afterAll(() => {
	// Restore original fetch
	global.fetch = originalFetch
})

beforeEach(() => {
	currentDrawId.set('drawId1')
	selectedUsers.set(testSelectedUsers)
	predictionStore.set(testPredictions)
})

describe('addUser', () => {
	test('Same current user, color is correct', async () => {
		currentUser.set(userWill)

		await addUser({
			selectorId: 'willId',
			id: 'userId4',
			username: 'bob'
		})

		const users = get(selectedUsers)
		expect(users).toHaveLength(5)
		expect(users[4].username).toBe('bob')
		expect(users[4].id).toBe('userId4')
		expect(users[4].color).toBe('bg-purple-300')
		expect(users[4].selectorId).toBe('willId')

		const predictions = get(predictionStore)
		expect(predictions).toHaveLength(8)
		expect(predictions[6].username).toBe('bob')
		expect(predictions[6].user_id).toBe('userId4')
		expect(predictions[6].color).toBe('bg-purple-300')
		expect(predictions[7].username).toBe('bob')
		expect(predictions[7].user_id).toBe('userId4')
		expect(predictions[7].color).toBe('bg-purple-300')
	})

	test('Different current user, color is correct', async () => {
		currentUser.set(userJames)

		await addUser({
			selectorId: 'jamesId',
			id: 'userId4',
			username: 'bob'
		})

		const users = get(selectedUsers)
		expect(users).toHaveLength(5)
		expect(users[4].username).toBe('bob')
		expect(users[4].id).toBe('userId4')
		expect(users[4].color).toBe('bg-yellow-300')
		expect(users[4].selectorId).toBe('jamesId')

		const predictions = get(predictionStore)
		expect(predictions).toHaveLength(8)
		expect(predictions[6].username).toBe('bob')
		expect(predictions[6].user_id).toBe('userId4')
		expect(predictions[6].color).toBe('bg-yellow-300')
		expect(predictions[7].username).toBe('bob')
		expect(predictions[7].user_id).toBe('userId4')
		expect(predictions[7].color).toBe('bg-yellow-300')
	})

	test('No more colors', async () => {
		currentUser.set(userWill)
		selectedUsers.set([
			...testSelectedUsers,
			{
				selectorId: 'willId',
				id: 'userId4',
				username: 'bob',
				color: 'bg-purple-300'
			},
			{
				selectorId: 'willId',
				id: 'userId5',
				username: 'billy',
				color: 'bg-orange-300'
			}
		])

		await addUser({
			selectorId: 'willId',
			id: 'userId4',
			username: 'jerry'
		})

		const users = get(selectedUsers)
		expect(users).toHaveLength(6)
	})
})

describe('removeUser', () => {
	test('Success', () => {
		currentUser.set(userWill)

		removeUser('userId2')

		const users = get(selectedUsers)
		expect(users).toHaveLength(3)
		expect(users[0].username).toBe('john')
		expect(users[0].id).toBe('userId1')
		expect(users[0].selectorId).toBe('willId')
		expect(users[0].color).toBe('bg-red-300')
		expect(users[1].username).toBe('sally')
		expect(users[1].id).toBe('userId3')
		expect(users[1].selectorId).toBe('willId')
		expect(users[1].color).toBe('bg-green-300')
		expect(users[2].username).toBe('john')
		expect(users[2].id).toBe('userId1')
		expect(users[2].selectorId).toBe('jamesId')
		expect(users[2].color).toBe('bg-red-300')

		const predictions = get(predictionStore)
		expect(predictions).toHaveLength(4)
		expect(predictions[0].username).toBe('john')
		expect(predictions[0].user_id).toBe('userId1')
		expect(predictions[0].color).toBe('bg-red-300')
		expect(predictions[1].username).toBe('john')
		expect(predictions[1].user_id).toBe('userId1')
		expect(predictions[1].color).toBe('bg-red-300')
		expect(predictions[2].username).toBe('sally')
		expect(predictions[2].user_id).toBe('userId3')
		expect(predictions[2].color).toBe('bg-green-300')
		expect(predictions[3].username).toBe('sally')
		expect(predictions[3].user_id).toBe('userId3')
		expect(predictions[3].color).toBe('bg-green-300')
	})

	test('No change', () => {
		currentUser.set(userWill)

		removeUser('userId4')

		const users = get(selectedUsers)
		expect(users).toEqual(testSelectedUsers)

		const predictions = get(predictionStore)
		expect(predictions).toEqual(testPredictions)
	})
})

describe('Add and remove user', () => {
	test('Same current user', async () => {
		currentUser.set(userWill)

		await addUser({
			selectorId: 'willId',
			id: 'userId4',
			username: 'bob'
		})

		removeUser('userId4')

		const users = get(selectedUsers)
		expect(users).toEqual(testSelectedUsers)
	})

	test('Different current user', async () => {
		currentUser.set(userJames)

		await addUser({
			selectorId: 'jamesId',
			id: 'userId4',
			username: 'bob'
		})

		removeUser('userId4')

		const users = get(selectedUsers)
		expect(users).toEqual(testSelectedUsers)
	})
})
