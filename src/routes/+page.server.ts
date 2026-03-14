import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { Draw, DrawResult, HomePageData, PbListResponse } from '$lib/types.js'
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

	const mensDraw = completed.find((d) => d.event === "Men's Singles")
	const womensDraw = completed.find((d) => d.event === "Women's Singles")

	const winnerFetches: (PbListResponse<DrawResult> | null)[] = await Promise.all([
		mensDraw
			? fetchJson(
					`${url}/api/collections/draw_results/records?filter=${encodeURIComponent(`(draw_id="${mensDraw.id}" && rank=1 && prediction_count > 0)`)}`,
					fetch,
					token
				)
			: null,
		womensDraw
			? fetchJson(
					`${url}/api/collections/draw_results/records?filter=${encodeURIComponent(`(draw_id="${womensDraw.id}" && rank=1 && prediction_count > 0)`)}`,
					fetch,
					token
				)
			: null
	])

	const mensWinnerResult =
		winnerFetches[0]?.items.sort((a, b) => a.username.localeCompare(b.username)) ?? []
	const womensWinnerResult =
		winnerFetches[1]?.items.sort((a, b) => a.username.localeCompare(b.username)) ?? []

	return {
		upcoming,
		active,
		completed,
		mensWinners: mensWinnerResult,
		womensWinners: womensWinnerResult
	} as HomePageData
}
