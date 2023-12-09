import { errorMessage } from '$lib/utils'
import { fail, type Actions } from '@sveltejs/kit'
import { format } from 'date-fns'
import type { ClientResponseError } from 'pocketbase'

export async function load({ fetch, locals }) {
	const today = format(new Date(), 'yyyy-mm-dd')

	const activeRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records?filter=(end_date>="${today}")`
	)
	const activeData = await activeRes.json()

	const completedRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records?filter=(end_date<"${today}")`
	)
	const completedData = await completedRes.json()

	return {
		active: activeData,
		completed: completedData,
		pb_auth_valid: locals.pb.authStore.isValid,
		pb_auth_cookie: locals.pb.authStore.exportToCookie()
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
