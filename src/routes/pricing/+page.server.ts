import type { Draw, PbListResponse, PricingPageData } from '$lib/types'
import { fetchJson } from '$lib/server/utils.js'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'

export async function load({ locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token

	const filter = `(end_date>=@now && (prediction_close>=@now || prediction_close=null))`
	const encoded = encodeURIComponent(filter)

	const draws: PbListResponse<Draw> = await fetchJson(
		`${url}/api/collections/draw/records?filter=${encoded}&sort=start_date,event,prediction_close&perPage=1`,
		fetch,
		token
	)

	return {
		drawForSale: draws.items[0]
	} as PricingPageData
}
