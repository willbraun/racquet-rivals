import type { Draw, PbListResponse } from '$lib/types.js'
import { errorMessage } from '$lib/utils'
import { fail, type Actions } from '@sveltejs/kit'
import { format } from 'date-fns'
import type { ClientResponseError } from 'pocketbase'

export async function load({ fetch, locals }) {
	const today = format(new Date(), 'yyyy-MM-dd')
	console.log(today)

	const activeRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records?filter=(end_date>="${today}")&sort=start_date,event`
	)
	const activeData: PbListResponse<Draw> = await activeRes.json()

	const completedRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records?filter=(end_date<"${today}")&sort=start_date,event`
	)
	const completedData: PbListResponse<Draw> = await completedRes.json()

	return {
		active: activeData,
		completed: completedData,
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string
	}
}

export const actions: Actions = {
	logout: async ({ cookies, locals }) => {
		try {
			locals.pb.authStore.clear()
			cookies.delete('currentUser')
			return {
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
