import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type { HomePageData } from '$lib/types.js'
import { errorMessage, fetchDraws } from '$lib/utils'
import { fail, type Actions } from '@sveltejs/kit'
import type { ClientResponseError } from 'pocketbase'

export async function load({ fetch, locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const [activeData, completedData] = await fetchDraws(fetch, url, locals.pb.authStore.token)

	return {
		active: activeData,
		completed: completedData,
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string,
		pb_auth_username: (locals.pb.authStore.model?.username ?? '') as string
	} as HomePageData
}

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		try {
			locals.pb.authStore.clear()
			cookies.delete('isLeaderboard', { path: '/' })
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
