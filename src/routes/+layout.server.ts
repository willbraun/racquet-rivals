import type { RootLayoutData } from '$lib/types'
import { fetchJson } from '$lib/server/utils.js'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'

export async function load({ locals }) {
	// locals.pb.authStore is updated on each request via hooks.server.ts

	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token

	const draws = await fetchJson(
		`${url}/api/collections/draw/records?sort=-start_date,event&perPage=1`,
		fetch,
		token
	)

	return {
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string,
		pb_auth_username: (locals.pb.authStore.record?.username ?? '') as string,
		pb_auth_user_id: (locals.pb.authStore.record?.id ?? '') as string,
		defaultDraw: draws.items[0]
	} as RootLayoutData
}
