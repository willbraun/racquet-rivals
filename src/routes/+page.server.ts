import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type { Banner, HomePageData, PbListResponse } from '$lib/types.js'
import { errorMessage, fetchDraws } from '$lib/utils'
import { fail, type Actions } from '@sveltejs/kit'
import type { ClientResponseError } from 'pocketbase'

export async function load({ fetch, locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const [activeData, completedData] = await fetchDraws(fetch, url, locals.pb.authStore.token)

	const bannerRes = await fetch(`${url}/api/collections/banner/records?perPage=1`)
	const bannerData: PbListResponse<Banner> = await bannerRes.json()

	return {
		active: activeData,
		completed: completedData,
		banner: bannerData.items[0],
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
