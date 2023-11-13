import { fail } from '@sveltejs/kit'
import { errorMessage, selectColors } from '$lib/utils'
import Pocketbase, { ClientResponseError } from 'pocketbase'
import type { AuthCookie, SelectedUser } from '$lib/types'

const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

export interface Draw {
	collectionId: string
	collectionName: 'draw'
	created: string
	end_date: string
	event: 'Mens Singles' | 'Womens Singles'
	id: string
	name: string
	prediction_close: string
	size: number
	start_date: string
	updated: string
	url: string
	year: number
}

export interface Slot {
	collectionId: string
	collectionName: 'draw_slot'
	created: string
	draw_id: string
	id: string
	name: string
	position: number
	round: number
	seed: string
	updated: string
}

interface SlotRes {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: Slot[]
}

export interface Prediction {
	collectionId: string
	collectionName: 'view_predictions'
	draw_id: string
	draw_slot_id: string
	id: string
	name: string
	points: number
	user_id: string
	username: string
}

interface PredictionRes {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: Prediction[]
}

export async function load({ fetch, params, cookies }) {
	const id: string = params.slug.split('-').at(-1) ?? ''
	const userId: string = JSON.parse(cookies.get('auth') ?? '{}').user?.id ?? ''
	const selectedUsers: SelectedUser[] = JSON.parse(cookies.get(`selectedUsers-${userId}`) ?? '[]')

	const drawRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records/${id}`
	)
	const drawData: Draw = await drawRes.json()

	const slotRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${id}")`
	)
	const slotData: SlotRes = await slotRes.json()

	const allUserIds = [userId, ...selectedUsers.map((user) => user.id)]
	const userFilter = allUserIds.map((id) => `user_id="${id}"`).join('||')
	const filter = `(draw_id="${id}" && (${userFilter}))`

	const encoded = encodeURIComponent(filter)
	const predictionRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/view_predictions/records?perPage=300&filter=${encoded}`
	)
	const predictionData: PredictionRes = await predictionRes.json()

	return {
		draw: drawData,
		slots: slotData,
		predictions: predictionData,
		auth: JSON.parse(cookies.get('auth') ?? '{}') as AuthCookie,
		selectedUsers: JSON.parse(cookies.get(`selectedUsers-${userId}`) ?? '[]') as SelectedUser[]
	}
}

export const actions = {
	selectUser: async ({ request, cookies }) => {
		const form = await request.formData()
		const username = (form.get('username') ?? '') as string
		const auth = JSON.parse(cookies.get('auth') ?? '{}') as AuthCookie
		const currentUsername = auth.user?.username ?? ''
		const currentUserId = auth.user?.id ?? ''
		const selectedUsers: SelectedUser[] = JSON.parse(
			cookies.get(`selectedUsers-${currentUserId}`) ?? '[]'
		)

		if (username === '') {
			return fail(400, {
				error: 'Please enter a username'
			})
		}

		const allUsernames = [currentUsername, ...selectedUsers.map((user) => user.username)]

		if (allUsernames.length >= 6) {
			return fail(400, {
				error: 'Exceeds max of 6 total'
			})
		}

		if (allUsernames.includes(username)) {
			return fail(400, {
				error: `User "${username}" is already selected`
			})
		}

		const usedColors = selectedUsers.map((user) => user.color)
		const availableColors = selectColors.filter((color) => !usedColors.includes(color))

		try {
			const data = await pb.collection('user').getFirstListItem(`username="${username}"`)
			selectedUsers.push({
				id: data.id,
				username: data.username,
				color: availableColors[0]
			})
			cookies.set(`selectedUsers-${currentUserId}`, JSON.stringify(selectedUsers), {
				maxAge: 60 * 60 * 24 * 400
			})
			return {
				user: {
					id: data.id,
					username: data.username,
					color: availableColors[0]
				} as SelectedUser,
				error: ''
			}
		} catch (e) {
			const statusCode = (e as ClientResponseError).status
			if (statusCode === 404) {
				return fail(statusCode, {
					error: 'Error: 404 - Username not found'
				})
			}
			return fail(statusCode, {
				error: errorMessage(e)
			})
		}
	},

	deselectUser: async ({ request, cookies }) => {
		const form = await request.formData()
		const userId = (form.get('userId') ?? '') as string
		const auth = JSON.parse(cookies.get('auth') ?? '{}') as AuthCookie
		const currentUserId = auth.user?.id ?? ''
		const selectedUsers: SelectedUser[] = JSON.parse(
			cookies.get(`selectedUsers-${currentUserId}`) ?? '[]'
		)

		try {
			const index = selectedUsers.map((user) => user.id).indexOf(userId)
			selectedUsers.splice(index, 1)
			cookies.set(`selectedUsers-${currentUserId}`, JSON.stringify(selectedUsers), {
				maxAge: 60 * 60 * 24 * 400
			})
			return {
				deletedId: userId,
				error: ''
			}
		} catch (e) {
			const statusCode = (e as ClientResponseError).status
			return fail(statusCode, {
				error: errorMessage(e)
			})
		}
	},

	addPrediction: async ({ request, cookies }) => {
		const form = await request.formData()
		const auth = JSON.parse(cookies.get('auth') ?? '{}') as AuthCookie
		console.log(form.get('predictionValue'))
		console.log(auth)
	}
}
