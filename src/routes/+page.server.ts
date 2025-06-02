import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { Draw, HomePageData, PbListResponse } from '$lib/types.js'
import { classifyDraws } from '$lib/utils.js'

export async function load({ fetch, locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token

	const draws: PbListResponse<Draw> = await fetchJson(
		`${url}/api/collections/draw/records?sort=-start_date,event`,
		fetch,
		token
	)

	const [upcoming, active, completed] = classifyDraws(draws.items)

	return {
		upcoming,
		active,
		completed
	} as HomePageData
}
