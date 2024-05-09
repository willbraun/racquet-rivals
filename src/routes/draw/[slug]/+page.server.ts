import { fail, type Actions } from '@sveltejs/kit'
import { errorMessage, fetchDraws, selectColors } from '$lib/utils'
import type { ClientResponseError } from 'pocketbase'
import type {
	Draw,
	DrawPageData,
	PbListResponse,
	Prediction,
	PredictionRecord,
	SelectedUser,
	Slot
} from '$lib/types'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'

export async function load({ fetch, params, cookies, locals }) {
	const id: string = params.slug.split('-').at(-1) ?? ''
	const url = PUBLIC_POCKETBASE_URL
	const currentUser: SelectedUser = JSON.parse(cookies.get('currentUser') ?? '{}')
	const selectedUsers: SelectedUser[] = JSON.parse(
		cookies.get(`selectedUsers-${currentUser.id}`) ?? '[]'
	)
	const options = {
		headers: {
			Authorization: locals.pb.authStore.token
		}
	}

	const drawRes = await fetch(`${url}/api/collections/draw/records/${id}`, options)
	const drawData: Draw = await drawRes.json()

	const slotRes = await fetch(
		`${url}/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${id}")`,
		options
	)
	const slotData: PbListResponse<Slot> = await slotRes.json()

	const allUserIds = [currentUser.id, ...selectedUsers.map((user) => user.id)]
	const userFilter = allUserIds.map((id) => `user_id="${id}"`).join('||')
	const filter = `(draw_id="${id}" && (${userFilter}))`
	const encoded = encodeURIComponent(filter)

	const predictionRes = await fetch(
		`${url}/api/collections/view_predictions/records?perPage=300&filter=${encoded}`,
		options
	)
	const predictionData: PbListResponse<Prediction> = await predictionRes.json()

	const [activeData, completedData] = await fetchDraws(fetch, url, locals.pb.authStore.token)

	return {
		active: activeData,
		completed: completedData,
		draw: drawData,
		slots: slotData,
		predictions: predictionData,
		currentUser: currentUser,
		selectedUsers: selectedUsers,
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string
	} as DrawPageData
}

export const actions: Actions = {
	selectUser: async ({ request, cookies, locals }) => {
		const form = await request.formData()
		const username = (form.get('username') ?? '') as string
		const currentUser: SelectedUser = JSON.parse(cookies.get('currentUser') ?? '{}')
		const selectedUsers: SelectedUser[] = JSON.parse(
			cookies.get(`selectedUsers-${currentUser.id}`) ?? '[]'
		)

		if (username === '') {
			return fail(400, {
				error: 'Please enter a username'
			})
		}

		const allUsernames = [currentUser.username, ...selectedUsers.map((user) => user.username)]

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
			const data = await locals.pb
				.collection('user')
				.getFirstListItem(`username~"${username}"&&"${username}"~username`) // search for username, case insensitive
			selectedUsers.push({
				id: data.id,
				username: data.username,
				color: availableColors[0]
			})
			/* @migration task: add path argument */ cookies.set(
				`selectedUsers-${currentUser.id}`,
				JSON.stringify(selectedUsers),
				{
					maxAge: 60 * 60 * 24 * 400,
					path: '/'
				}
			)
			return {
				user: {
					id: data.id,
					username: data.username,
					color: availableColors[0]
				} as SelectedUser,
				error: ''
			}
		} catch (e) {
			console.log(e)
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
		const currentUser: SelectedUser = JSON.parse(cookies.get('currentUser') ?? '{}')
		const selectedUsers: SelectedUser[] = JSON.parse(
			cookies.get(`selectedUsers-${currentUser.id}`) ?? '[]'
		)

		try {
			const index = selectedUsers.map((user) => user.id).indexOf(userId)
			selectedUsers.splice(index, 1)
			cookies.set(`selectedUsers-${currentUser.id}`, JSON.stringify(selectedUsers), {
				maxAge: 60 * 60 * 24 * 400,
				path: '/'
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

	addPrediction: async ({ request, locals }) => {
		const form = await request.formData()
		const slotId = (form.get('slotId') ?? '') as string
		const currentPredictionId = (form.get(`currentPredictionId`) ?? '') as string
		const predictionValue = (form.get(`predictionValue`) ?? '') as string

		if (!locals.pb.authStore.isValid || !locals.pb.authStore.model) {
			return fail(400, {
				error: 'Must be logged in to make a prediction'
			})
		}

		if (!predictionValue) {
			return fail(400, {
				error: `Invalid prediction: "${predictionValue}"`
			})
		}

		if (!slotId) {
			return fail(400, {
				error: `Invalid slot: "${slotId}"`
			})
		}

		const data = {
			draw_slot_id: slotId,
			user_id: locals.pb.authStore.model.id,
			name: predictionValue,
			points: 0
		}

		if (currentPredictionId) {
			try {
				const record: PredictionRecord = await locals.pb
					.collection('prediction')
					.update(currentPredictionId, data)
				return {
					record
				}
			} catch (e) {
				const statusCode = (e as ClientResponseError).status
				return fail(statusCode, {
					error: errorMessage(e)
				})
			}
		} else {
			try {
				const record: PredictionRecord = await locals.pb.collection('prediction').create(data)
				return {
					record
				}
			} catch (e) {
				const statusCode = (e as ClientResponseError).status
				return fail(statusCode, {
					error: errorMessage(e)
				})
			}
		}
	}
}
