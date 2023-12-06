import { fail } from '@sveltejs/kit'
import { errorMessage, selectColors } from '$lib/utils'
import Pocketbase, { ClientResponseError } from 'pocketbase'
import type { Draw, PredictionRes, SelectedUser, SlotRes } from '$lib/types'

// const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

export async function load({ fetch, params, cookies }) {
	const id: string = params.slug.split('-').at(-1) ?? ''
	const currentUser: SelectedUser = JSON.parse(cookies.get('currentUser') ?? '{}')
	const selectedUsers: SelectedUser[] = JSON.parse(
		cookies.get(`selectedUsers-${currentUser.id}`) ?? '[]'
	)

	const drawRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records/${id}`
	)
	// const drawRes = await locals.pb.collection('draw')
	const drawData: Draw = await drawRes.json()

	const slotRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${id}")`
	)
	const slotData: SlotRes = await slotRes.json()

	const allUserIds = [currentUser.id, ...selectedUsers.map((user) => user.id)]
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
		currentUser: currentUser,
		selectedUsers: selectedUsers,
		pb_auth: cookies.get('pb_auth')
	}
}

export const actions = {
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
			console.log(locals.pb.authStore.isValid)
			const data = await locals.pb.collection('user').getFirstListItem(`username="${username}"`)
			selectedUsers.push({
				id: data.id,
				username: data.username,
				color: availableColors[0]
			})
			cookies.set(`selectedUsers-${currentUser.id}`, JSON.stringify(selectedUsers), {
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
			console.log(e)
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
	}
}
