import type { ClientResponseError } from 'pocketbase'
import { pb } from '$lib/pocketbase'
import {
	selectedUsers,
	mySelectedUsers,
	currentDrawId,
	predictionStore,
	predictionsError,
	currentUser
} from './store'
import {
	DrawStatus,
	type Draw,
	type DrawResult,
	type Prediction,
	type SelectedUser,
	type SelectedUserNoColor,
	type Slot
} from './types'
import { get } from 'svelte/store'
import { selectColors } from './data'
import { cubicInOut } from 'svelte/easing'
import { type TransitionConfig } from 'svelte/transition'
import { getPredictions } from './api'

type ErrorObjData = {
	[key: string]: {
		code: string
		message: string
	}
}

export const errorMessage = (error: unknown) => {
	const errorObj = error as ClientResponseError
	const data = errorObj?.data?.data as ErrorObjData
	let dataMessage = ''

	if (data && Object.keys(data).length > 0) {
		dataMessage = Object.entries(data)
			.map(([key, value]) => `• ${capitalize(key)}: ${value.message}`)
			.join('\n')
	}

	const result = `Error: ${errorObj.status} - ${errorObj.message}${
		dataMessage && `\n${dataMessage}`
	}`
	console.error(result)
	return result
}

export const capitalize = (str: string) => {
	if (!str) return ''
	return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

export const makeSetType = <T>() => {
	return (result: object): T => {
		return result as T
	}
}

const isDraw = (draw: Draw | DrawResult): draw is Draw => {
	return draw.collectionName === 'draw'
}

const isDrawResult = (draw: Draw | DrawResult): draw is DrawResult => {
	return draw.collectionName === 'draw_results'
}

const slugify = (str: string) => str.toLowerCase().replaceAll(' ', '-').replaceAll("'", '')

export const getSlug = (draw: Draw | DrawResult): string => {
	if (isDraw(draw)) {
		return `${slugify(draw.name)}-${slugify(draw.event)}-${draw.year}-${draw.id}`
	} else if (isDrawResult(draw)) {
		return `${slugify(draw.draw_name)}-${slugify(draw.draw_event)}-${draw.draw_year}-${draw.draw_id}`
	} else {
		return ''
	}
}

export const getTitle = (draw: Draw | DrawResult): string => {
	if (isDraw(draw)) {
		return `${draw.name} ${draw.event} ${draw.year}`
	} else if (isDrawResult(draw)) {
		return `${draw.draw_name} ${draw.draw_event} ${draw.draw_year}`
	} else {
		return ''
	}
}

const getNextColor = (users: SelectedUser[]) => {
	const userColors = new Set(users.map((user) => user.color))
	return selectColors.find((color) => !userColors.has(color)) || ''
}

export const addUser = async (user: SelectedUserNoColor) => {
	const users = get(selectedUsers)
	const myUsers = get(mySelectedUsers)
	const drawId = get(currentDrawId)
	const color = getNextColor(myUsers)

	if (!color) {
		return
	}

	const newUser: SelectedUser = {
		...user,
		color
	}

	try {
		const newUserPredictionRecords = await getPredictions(drawId, [newUser], pb.authStore.token)
		const newUserPredictions: Prediction[] = newUserPredictionRecords.items.map((record) => ({
			...record,
			color
		}))

		const newUsers = [...users, newUser]
		selectedUsers.set(newUsers)
		predictionStore.update((predictions) => [...predictions, ...newUserPredictions])
		predictionsError.set('')
	} catch (error) {
		predictionsError.set(
			`Error: ${error instanceof Error ? error.message : `Failed to load predictions for ${newUser.username}`}`
		)
	}
}

export const removeUser = (userId: string) => {
	const users = get(selectedUsers)
	const remainingUsers = users.filter((user) => {
		if (user.selectorId === get(currentUser)?.id) {
			return user.id !== userId
		} else {
			return true
		}
	})

	const remainingUsersPredictions = get(predictionStore).filter(
		(prediction) => prediction.user_id !== userId
	)

	selectedUsers.set(remainingUsers)
	predictionStore.set(remainingUsersPredictions)
}

export const getDrawStatus = (startDate: string, endDate: string): DrawStatus => {
	const now = new Date()
	const start = new Date(startDate)
	const end = new Date(endDate)

	if (now < start) {
		return DrawStatus.UPCOMING
	} else if (now > end) {
		return DrawStatus.COMPLETED
	} else {
		return DrawStatus.ACTIVE
	}
}

export const formatAvg = (num: number | null): string => {
	if (num === null) {
		return 'N/A'
	}

	let result: string
	const rounded = Math.round(num * 100) / 100
	if (Number.isInteger(rounded)) {
		result = rounded.toString()
	} else if (Number.isInteger(rounded * 10)) {
		result = rounded.toFixed(1)
	} else {
		result = rounded.toFixed(2)
	}

	return result
}

export const formatPercent = (num: number | null): string => {
	if (num === null) {
		return 'N/A'
	}

	let result: string
	if (Number.isInteger(num)) {
		result = num.toString()
	} else {
		const rounded = Math.round(num * 100) / 100
		if (Number.isInteger(rounded)) {
			result = rounded.toString()
		} else {
			result = rounded.toFixed(1)
		}
	}

	return `${result}%`
}

interface SlideParams {
	duration?: number
	x?: number
	containerTop?: number
}
export function customSlide(
	_: HTMLElement,
	{ duration = 250, x = 0, containerTop = 0 }: SlideParams = {}
): TransitionConfig {
	return {
		duration,
		css: (t: number): string => {
			const eased = cubicInOut(t)
			return `
				position: fixed;
				top: ${containerTop}px;
				transform: translateX(${(1 - eased) * x}px);
			`
		}
	}
}

export const getFullDrawRounds = (draw: Draw): number => {
	return Math.log2(draw.size) + 1
}

export const getAllRounds = (fullDrawRounds: number): number[] => {
	return [...Array(fullDrawRounds).keys()].map((x) => x + 1)
}

export const getOurRounds = (allRounds: number[]): number[] => {
	return allRounds.slice(-5)
}

export const generateDummySlots = (
	drawId: string,
	startRound: number,
	endRound: number
): Slot[] => {
	const numRounds = endRound - startRound + 1
	const dummySlots: Slot[] = []
	for (let i = 0; i < numRounds; i++) {
		const numPositions = 2 ** (numRounds - 1 - i)
		for (let j = 0; j < numPositions; j++) {
			const round = startRound + i
			const position = j + 1
			dummySlots.push({
				collectionId: 'x9dn3y760dvxbek',
				collectionName: 'slots_with_scores',
				created: '2024-05-02 15:48:21.972Z',
				draw_id: drawId,
				id: 'dummySlotId_' + round + '_' + position,
				round,
				position,
				name: '',
				seed: '',
				updated: '2024-05-02 15:48:21.972Z',
				set1_id: 'set1_dummy',
				set1_games: null,
				set1_tiebreak: null,
				set2_id: 'set2_dummy',
				set2_games: null,
				set2_tiebreak: null,
				set3_id: 'set3_dummy',
				set3_games: null,
				set3_tiebreak: null,
				set4_id: 'set4_dummy',
				set4_games: null,
				set4_tiebreak: null,
				set5_id: 'set5_dummy',
				set5_games: null,
				set5_tiebreak: null
			})
		}
	}

	return dummySlots
}

export const classifyDraws = (draws: Draw[]) => {
	const today = new Date()
	let upcoming: Draw[] = []
	let active: Draw[] = []
	let completed: Draw[] = []
	for (const draw of draws) {
		if (new Date(draw.start_date) >= today) {
			upcoming.push(draw)
		} else if (new Date(draw.start_date) <= today && new Date(draw.end_date) >= today) {
			active.push(draw)
		} else if (new Date(draw.end_date) < today) {
			completed.push(draw)
		}
	}

	return [upcoming, active, completed]
}
