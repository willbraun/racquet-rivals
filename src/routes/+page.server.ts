import { errorMessage, fetchDraws } from '$lib/utils'
import { fail, type Actions } from '@sveltejs/kit'
import type { ClientResponseError } from 'pocketbase'

export async function load({ fetch, locals }) {
	const [activeData, completedData] = await fetchDraws(fetch, locals.pb.authStore.token)

	return {
		active: activeData,
		completed: completedData,
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string,
		pb_auth_username: (locals.pb.authStore.model?.username ?? '') as string
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
