import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { Banner, Draw, HomePageData, PbListResponse } from '$lib/types.js'
import { format } from 'date-fns'

export async function load({ fetch, locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const today = format(new Date(), 'yyyy-MM-dd')
	const token = locals.pb.authStore.token

	const [active, completed, banner]: [
		PbListResponse<Draw>,
		PbListResponse<Draw>,
		PbListResponse<Banner>
	] = await Promise.all([
		fetchJson(
			`${url}/api/collections/draw/records?filter=(end_date>="${today}")&sort=-start_date,event`,
			fetch,
			token
		),
		fetchJson(
			`${url}/api/collections/draw/records?filter=(end_date<"${today}")&sort=-start_date,event`,
			fetch,
			token
		),
		fetchJson(`${url}/api/collections/banner/records?perPage=1`, fetch, token)
	])

	return {
		active,
		completed,
		banner: banner.items[0]
	} as HomePageData
}
