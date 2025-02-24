import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { SCRIPT_USERNAME } from '$env/static/private'
import { fetchJson } from '$lib/server/utils.js'
import type {
	AveragePoints,
	DrawResult,
	OverallRank,
	PbListResponse,
	PredictionAccuracy,
	ProfilePageData,
	User
} from '$lib/types.js'
import { error } from '@sveltejs/kit'

export async function load({ fetch, params }) {
	const username = params.username.trim()
	const url = PUBLIC_POCKETBASE_URL

	const userData: PbListResponse<User> = await fetchJson(
		`${url}/api/collections/user/records?filter=(username="${username}")`,
		fetch
	)
	const user = userData.items[0]

	if (!user || username === SCRIPT_USERNAME) {
		throw error(404, 'User not found')
	}

	const [averagePoints, predictionAccuracy, overallRank, drawResults]: [
		AveragePoints,
		PredictionAccuracy,
		OverallRank,
		PbListResponse<DrawResult>
	] = await Promise.all([
		fetchJson(`${url}/api/collections/average_points/records/${user.id}_avg`, fetch),
		fetchJson(`${url}/api/collections/prediction_accuracy/records/${user.id}_acc`, fetch),
		fetchJson(`${url}/api/collections/overall_leaderboard/records/${user.id}_rank`, fetch),
		fetchJson(
			`${url}/api/collections/draw_results/records?perPage=255&filter=(user_id="${user.id}")&sort=-draw_end_date,draw_event`,
			fetch
		)
	])

	return {
		username: user.username,
		created: user.created,
		averagePoints,
		predictionAccuracy,
		overallRank,
		drawResults
	} as ProfilePageData
}
