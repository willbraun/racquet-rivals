import { fail, type Actions } from '@sveltejs/kit'
import { errorMessage } from '$lib/utils'
import { mainColor } from '$lib/data'
import { fetchJson } from '$lib/server/utils'
import type { ClientResponseError } from 'pocketbase'
import type {
	Draw,
	DrawPageData,
	DrawResult,
	PbListResponse,
	PredictionRecord,
	SelectedUser,
	SelectedUserNoColor,
	Slot
} from '$lib/types'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { SCRIPT_USERNAME } from '$env/static/private'
import { getPredictions } from '$lib/api.js'
import { format } from 'date-fns'

const getCurrentUser = (locals: App.Locals): SelectedUser => {
	return {
		selectorId: locals.pb.authStore.record?.id ?? '',
		id: locals.pb.authStore.record?.id ?? '',
		username: locals.pb.authStore.record?.username ?? '',
		color: mainColor
	}
}

export async function load({ fetch, params, locals, cookies }) {
	const id: string = params.slug.split('-').at(-1) ?? ''
	const url = PUBLIC_POCKETBASE_URL
	const currentUser = getCurrentUser(locals)
	const today = format(new Date(), 'yyyy-MM-dd')
	const token = locals.pb.authStore.token

	const [active, completed, draw, slots, drawResults]: [
		PbListResponse<Draw>,
		PbListResponse<Draw>,
		Draw,
		PbListResponse<Slot>,
		PbListResponse<DrawResult>
	] = await Promise.all([
		fetchJson(
			`${url}/api/collections/draw/records?filter=(end_date>="${today}")&sort=-start_date,event`,
			token,
			fetch
		),
		fetchJson(
			`${url}/api/collections/draw/records?filter=(end_date<"${today}")&sort=-start_date,event`,
			token,
			fetch
		),
		fetchJson(`${url}/api/collections/draw/records/${id}`, token, fetch),
		fetchJson(
			`${url}/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${id}")`,
			token,
			fetch
		),
		fetchJson(
			`${url}/api/collections/draw_results/records?perPage=255&filter=${encodeURIComponent(
				`(draw_id="${id}" && prediction_count > 0)`
			)}`,
			token,
			fetch
		)
	])

	const cookieSelectedUsers: SelectedUser[] = JSON.parse(cookies.get('selectedUsers') ?? '[]')
	const allUsers = [currentUser, ...cookieSelectedUsers]
	const predictionData = await getPredictions(id, allUsers, locals.pb.authStore.token)

	return {
		active,
		completed,
		draw,
		slots,
		drawResults,
		predictions: predictionData,
		currentUser: currentUser,
		cookieSelectedUsers: cookieSelectedUsers,
		isLeaderboard: cookies.get('isLeaderboard')
	} as DrawPageData
}

export const actions: Actions = {
	selectUser: async ({ request, locals }) => {
		const form = await request.formData()
		const username = (form.get('username') ?? '') as string
		const currentUser = getCurrentUser(locals)

		if (username === '') {
			return fail(400, {
				error: 'Please enter a username'
			})
		}

		if (username === SCRIPT_USERNAME) {
			return fail(404, {
				error: 'Error: 404 - Username not found'
			})
		}

		try {
			// search for username, case insensitive
			const data = await locals.pb
				.collection('user')
				.getFirstListItem(`username~"${username}"&&"${username}"~username`)
			return {
				user: {
					selectorId: currentUser.id,
					id: data.id,
					username: data.username
				} as SelectedUserNoColor,
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

	addPrediction: async ({ request, locals }) => {
		const form = await request.formData()
		const slotId = (form.get('slotId') ?? '') as string
		const currentPredictionId = (form.get(`currentPredictionId`) ?? '') as string
		const predictionValue = (form.get(`predictionValue`) ?? '') as string

		if (!locals.pb.authStore.isValid || !locals.pb.authStore.record) {
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
			user_id: locals.pb.authStore.record.id,
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
