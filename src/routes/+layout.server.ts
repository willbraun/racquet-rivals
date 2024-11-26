import type { RootLayoutData } from '$lib/types'
import { fetchJson } from '$lib/server/utils.js'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'

export async function load({ locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token

	const draws = await fetchJson(
		`${url}/api/collections/draw/records?sort=-start_date,event&perPage=1`,
		token,
		fetch
	)

	return {
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string,
		pb_auth_username: (locals.pb.authStore.model?.username ?? '') as string,
		defaultDraw: draws.items[0]
	} as RootLayoutData
}
