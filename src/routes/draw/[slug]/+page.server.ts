import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson, getActiveRound } from '$lib/server/utils'
import type { Draw, DrawPageData, DrawResult, PbListResponse, Slot } from '$lib/types'
import { classifyDraws, generateDummySlots, getFullDrawRounds, getTitle } from '$lib/utils'

export async function load({ fetch, params, locals, cookies }) {
	const id: string = params.slug.split('-').at(-1) ?? ''
	const url = PUBLIC_POCKETBASE_URL
	const userId = locals.pb.authStore.record?.id ?? ''
	const token = locals.pb.authStore.token

	const [draws, draw, slots, drawResults]: [
		PbListResponse<Draw>,
		Draw,
		PbListResponse<Slot>,
		PbListResponse<DrawResult>
	] = await Promise.all([
		fetchJson(`${url}/api/collections/draw/records?sort=-start_date,event`, fetch, token),
		fetchJson(`${url}/api/collections/draw/records/${id}`, fetch, token),
		fetchJson(
			`${url}/api/collections/slots_with_scores/records?perPage=255&filter=(draw_id="${id}")`,
			fetch,
			token
		),
		fetchJson(
			`${url}/api/collections/draw_results/records?perPage=255&filter=${encodeURIComponent(
				`(draw_id="${id}" && prediction_count > 0)`
			)}`,
			fetch,
			token
		)
	])

	const [upcoming, active, completed] = classifyDraws(draws.items)

	const activeRound = getActiveRound(draw, slots.items)
	const fullDrawRounds = getFullDrawRounds(draw)
	const startRound = fullDrawRounds - 4
	const renderedSlots =
		slots.items.length > 0
			? slots.items.filter((slot) => slot.round >= fullDrawRounds - 4)
			: generateDummySlots(draw.id, startRound, fullDrawRounds)

	return {
		upcoming,
		active,
		completed,
		draw,
		activeRound,
		slots: renderedSlots,
		drawResults,
		isLeaderboard: cookies.get('isLeaderboard') === 'true',
		title: getTitle(draw),
		description: `Draw page for ${getTitle(draw)}. Make predictions, view results, and track your progress in the tournament.`
	} as DrawPageData
}
