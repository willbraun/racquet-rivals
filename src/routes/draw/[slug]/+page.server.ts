import { fail } from '@sveltejs/kit'
import { errorMessage } from '$lib/utils'
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

interface Slot {
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

interface Prediction {
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
	const userId: string = JSON.parse(cookies.get('auth') ?? '{}').userId ?? ''

	const drawRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records/${id}`
	)
	const drawData: Draw = await drawRes.json()

	const slotRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${id}")`
	)
	const slotData: SlotRes = await slotRes.json()

	const filter = `(draw_id="${id}" && user_id="${userId}")`
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
		selectedUsers: JSON.parse(cookies.get('selectedUsers') ?? '[]') as SelectedUser[]
	}
}

export const actions = {
	selectUser: async ({ request, cookies }) => {
		const form = await request.formData()
		const username = (form.get('username') ?? '') as string
		const selectedUsers: SelectedUser[] = JSON.parse(cookies.get('selectedUsers') ?? '[]')

		if (username === '') {
			return fail(400, {
				error: 'Please enter a username'
			})
		}

		try {
			const data = await pb.collection('user').getFirstListItem(`username="${username}"`)
			selectedUsers.push({
				id: data.id,
				username: data.username
			})
			cookies.set('selectedUsers', JSON.stringify(selectedUsers), {
				maxAge: 60 * 60 * 24 * 7
			})
			return {
				user: {
					id: data.id,
					username: data.username
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
		const selectedUsers: SelectedUser[] = JSON.parse(cookies.get('selectedUsers') ?? '[]')

		try {
			const index = selectedUsers.map((user) => user.id).indexOf(userId)
			selectedUsers.splice(index, 1)
			cookies.set('selectedUsers', JSON.stringify(selectedUsers), {
				maxAge: 60 * 60 * 24 * 7
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
	}
}
