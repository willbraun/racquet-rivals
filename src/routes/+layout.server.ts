import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { Draw, PbListResponse, RootLayoutData } from '$lib/types'

export async function load({ locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token

	let draws: PbListResponse<Draw>
	draws = await fetchJson(
		`${url}/api/collections/draw/records?filter=(end_date>=@now)&sort=start_date,event&perPage=1`,
		fetch,
		token
	)

	if (draws.items.length === 0) {
		draws = await fetchJson(
			`${url}/api/collections/draw/records?sort=-end_date,event&perPage=1`,
			fetch,
			token
		)
	}

	return {
		cookieCurrentUser: locals.pb.authStore.record,
		defaultDraw: draws.items[0]
	} as RootLayoutData
}
