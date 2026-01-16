import PageSetup from '$lib/components/PageSetup.test.svelte'
import { currentUser, predictionStore, selectedUsers } from '$lib/store'
import type {
	Draw,
	DrawPageData,
	DrawResult,
	PbListResponse,
	SelectedUser,
	Slot,
	UserRecord,
	ViewPredictionRecord
} from '$lib/types'
import { generateDummySlots } from '$lib/utils'
import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor, within } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import Page from './+page.svelte'

const emptySlotData = generateDummySlots('j5mehm6fvdf9105', 4, 8)

const data: DrawPageData = {
	upcoming: [],
	active: [
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'draw',
			created: '2024-05-02 15:42:20.397Z',
			end_date: '2024-06-09 23:00:00.000Z',
			event: "Men's Singles",
			id: 'j5mehm6fvdf9105',
			name: 'French Open',
			prediction_close: '',
			size: 128,
			start_date: '2024-05-26 12:00:00.000Z',
			updated: '2024-05-02 15:44:08.159Z',
			url: 'https://www.atptour.com/en/scores/archive/roland-garros/520/2024/draws',
			year: 2024
		}
	],
	completed: [
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'draw',
			created: '2024-05-02 15:42:20.397Z',
			end_date: '2024-06-09 23:00:00.000Z',
			event: "Men's Singles",
			id: '757duh3a8vpgyrq',
			name: 'Australian Open',
			prediction_close: '2024-01-28 05:32:34.187Z',
			size: 128,
			start_date: '2024-01-13 13:00:00.000Z',
			updated: '2024-01-27 19:47:22.187Z',
			url: 'https://www.atptour.com/en/scores/current/australian-open/580/draws',
			year: 2024
		}
	],
	draw: {
		collectionId: 'zpjgxcf4d9ojqcd',
		collectionName: 'draw',
		created: '2024-05-02 15:42:20.397Z',
		end_date: '2024-06-09 23:00:00.000Z',
		event: "Men's Singles",
		id: 'j5mehm6fvdf9105',
		name: 'French Open',
		prediction_close: '',
		size: 128,
		start_date: '2024-05-26 12:00:00.000Z',
		updated: '2024-05-02 15:44:08.159Z',
		url: 'https://www.atptour.com/en/scores/archive/roland-garros/520/2024/draws',
		year: 2024
	} as Draw,
	activeRound: 'Qualifying Rounds',
	slots: emptySlotData,
	drawResults: {
		items: [
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw_results',
				draw_id: 'j5mehm6fvdf9105',
				id: 'j5mehm6fvdf9105',
				total_points: 16,
				rank: 1,
				user_id: 'userId',
				username: 'will'
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw_results',
				draw_id: 'j5mehm6fvdf9105',
				id: 'j5mehm6fvdf9105',
				total_points: 12,
				rank: 2,
				user_id: 'userId',
				username: 'john'
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw_results',
				draw_id: 'j5mehm6fvdf9105',
				id: 'j5mehm6fvdf9105',
				total_points: 8,
				rank: 3,
				user_id: 'userId',
				username: 'steve'
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw_results',
				draw_id: 'j5mehm6fvdf9105',
				id: 'j5mehm6fvdf9105',
				total_points: 4,
				rank: 4,
				user_id: 'userId',
				username: 'sally'
			}
		] as DrawResult[],
		page: 1,
		perPage: 30,
		totalItems: 4,
		totalPages: 1
	} as PbListResponse<DrawResult>,
	predictionDistribution: {
		items: [],
		page: 1,
		perPage: 30,
		totalItems: 0,
		totalPages: 0
	},
	isLeaderboard: false,
	title: 'French Open',
	description: 'View the draw for the French Open.'
}

// Mock the Resize Observer
class ResizeObserverMock {
	constructor(private callback: ResizeObserverCallback) {}

	observe(target: Element) {
		// Immediately invoke the callback with an entry that indicates the target is resized
		this.callback(
			[{ target, contentRect: target.getBoundingClientRect() } as ResizeObserverEntry],
			this
		)
	}

	unobserve() {
		// No-op
	}

	disconnect() {
		// No-op
	}
}

// Mock the global ResizeObserver
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.ResizeObserver = ResizeObserverMock as any

// Mock the element.animate function
global.Element.prototype.animate = vi.fn().mockReturnValue({
	onfinish: null,
	play: vi.fn(),
	pause: vi.fn(),
	finish: vi.fn(),
	cancel: vi.fn(),
	reverse: vi.fn(),
	commitStyles: vi.fn(),
	persist: vi.fn(),
	currentTime: 0,
	playbackRate: 1,
	startTime: null,
	timeline: null,
	ready: Promise.resolve(),
	finished: Promise.resolve()
})

const mockViewPredictionRecords = [
	{
		collectionId: 'collectionId',
		collectionName: 'view_predictions',
		draw_id: 'drawId',
		draw_slot_id: 'drawSlotId',
		round: 7,
		position: 1,
		seed: '(1)',
		id: 'predictionId1',
		name: 'Roger Federer',
		points: 4,
		user_id: 'willId',
		username: 'will'
	},
	{
		collectionId: 'collectionId',
		collectionName: 'view_predictions',
		draw_id: 'drawId',
		draw_slot_id: 'drawSlotId',
		round: 7,
		position: 2,
		seed: '(2)',
		id: 'predictionId2',
		name: 'Bad PredictionTest',
		points: 4,
		user_id: 'willId',
		username: 'will'
	},
	{
		collectionId: 'collectionId',
		collectionName: 'view_predictions',
		draw_id: 'drawId',
		draw_slot_id: 'drawSlotId',
		round: 8,
		position: 1,
		seed: '(1)',
		id: 'predictionId3',
		name: 'Roger Federer',
		points: 8,
		user_id: 'willId',
		username: 'will'
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

const initialSelections: SelectedUser[] = []
const predictions = mockViewPredictionRecords.map((p) => ({
	...p,
	color: 'bg-blue-300'
}))

const testUser: UserRecord = {
	collectionId: '_pb_users_auth_',
	collectionName: 'user',
	avatar: '',
	id: 'willId',
	username: 'will',
	role: 'user',
	emailVisibility: true,
	created: '2024-05-02 15:42:20.397Z',
	updated: '2024-05-02 15:42:20.397Z'
}

describe('Draw page component', () => {
	beforeEach(() => {
		currentUser.set(testUser)
		selectedUsers.set(initialSelections)
		predictionStore.set(predictions)
	})

	afterEach(() => {
		selectedUsers.set(initialSelections)
		predictionStore.set(predictions)
	})

	test('Renders', async () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText('Active Round:')).toHaveTextContent('Active Round: Qualifying Rounds')
		expect(screen.getByText('Predictions open until:')).toHaveTextContent(
			'Predictions open until: 12 hours after Round of 16 is full, around June 1st'
		)
		expect(screen.queryByText('Log in to select')).not.toBeInTheDocument()
		expect(screen.queryByText('Predictions closed:')).not.toBeInTheDocument()
		expect(screen.getByTestId('SlotNameR8P1')).toHaveTextContent('TBD')
	})

	test('Logged out', () => {
		currentUser.set(null)
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText('will')).toBeInTheDocument()
		expect(screen.getByText('TereseM')).toBeInTheDocument()
		expect(screen.getByText('Log in to select')).toBeInTheDocument()
	})

	test('Active round shows', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data: {
					...data,
					activeRound: 'Round of 16'
				}
			}
		})

		expect(screen.getByText('Active Round:')).toHaveTextContent('Active Round: Round of 16')
	})

	test('Predictions closed', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data: {
					...data,
					draw: {
						...data.draw,
						prediction_close: '2024-01-28 05:32:34.187Z' // UTC
					}
				}
			}
		})

		expect(screen.getByText('Predictions closed:')).toHaveTextContent(
			'Predictions closed: Jan 28, 2024 12:32am' // America/New_York
		)
		expect(screen.queryByText('Predictions open until:')).not.toBeInTheDocument()
	})

	test('Selected users render', () => {
		const testSelectedUsers = [
			{
				selectorId: 'userId',
				id: 'userId1',
				username: 'john',
				color: 'bg-red-300'
			},
			{
				selectorId: 'userId',
				id: 'userId2',
				username: 'steve',
				color: 'bg-yellow-300'
			},
			{
				selectorId: 'userId',
				id: 'userId3',
				username: 'sally',
				color: 'bg-green-300'
			}
		]

		currentUser.set({
			...testUser,
			id: 'userId'
		})
		selectedUsers.set(testSelectedUsers)

		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText('john')).toBeInTheDocument()
		expect(screen.getByText('steve')).toBeInTheDocument()
		expect(screen.getByText('sally')).toBeInTheDocument()
	})

	test('Points tallied correctly', async () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByTestId('User_will')).toHaveTextContent('will')
		expect(screen.getByTestId('User_will')).toHaveClass('bg-blue-300')
		expect(screen.getByTestId('UserPoints_will')).toHaveTextContent('16')
	})

	test('Leaderboard toggles in and out', async () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const leaderboardToggle = screen.getByTestId('LeaderboardToggle')
		const buttons = within(leaderboardToggle).getAllByRole('button')

		expect(buttons[0]).toHaveClass('text-white')
		expect(buttons[1]).not.toHaveClass('text-white')
		expect(screen.getByTestId('Draw')).toBeInTheDocument()
		expect(screen.queryByTestId('Leaderboard')).not.toBeInTheDocument()

		await userEvent.click(buttons[1])
		expect(buttons[0]).not.toHaveClass('text-white')
		expect(buttons[1]).toHaveClass('text-white')
		expect(screen.getByTestId('Leaderboard')).toBeInTheDocument()

		await userEvent.click(buttons[0])
		expect(buttons[0]).toHaveClass('text-white')
		expect(buttons[1]).not.toHaveClass('text-white')
	})

	test('Correct slots render, 128 draw', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const totalRounds = 8
		for (let round = 1; round <= totalRounds; round++) {
			const positions = 2 ** (totalRounds - round)
			for (let position = 1; position <= positions; position++) {
				const testId = `SlotNameR${round}P${position}`
				if (round >= 4) {
					expect(screen.getByTestId(testId)).toBeInTheDocument()
				} else {
					expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
				}
			}
		}
	})

	test('Slot renders with data', () => {
		const slot = emptySlotData.at(-1) as Slot
		const newSlot = {
			...slot,
			name: 'Roger Federer',
			seed: '(1)'
		} as Slot
		const newSlots = emptySlotData.with(-1, newSlot) as Slot[]

		render(PageSetup, {
			props: {
				component: Page,
				data: {
					...data,
					slots: newSlots
				}
			}
		})

		expect(screen.getByTestId('SlotNameR8P1')).toHaveTextContent('(1) Roger Federer')
	})

	test('Slot renders without data', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByTestId('SlotNameR8P1')).toHaveTextContent('TBD')
		expect(screen.queryByTestId('SlotScoreR8P1')).not.toBeInTheDocument()
	})
})

describe('Error handling', () => {
	beforeEach(() => {
		vi.mocked(global.fetch).mockReset()
	})

	test('getPredictions error', async () => {
		const errorMessage = 'Error: 500 - Internal Server Error'

		// Make fetch reject with the specific error for this test only
		vi.mocked(global.fetch).mockRejectedValueOnce(new Error(errorMessage))

		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(global.fetch).toHaveBeenCalledTimes(1)

		// Wait for the error to appear in the component
		await waitFor(() => {
			expect(screen.getByTestId('PredictionsError')).toBeInTheDocument()
			expect(screen.getByTestId('PredictionsError')).toHaveTextContent(errorMessage)
		})
	})
})
