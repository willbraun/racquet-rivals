import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
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
import { redirect, error } from '@sveltejs/kit'

export async function load({ fetch, params, locals }) {
	const token = locals.pb.authStore.token
	if (!token) {
		redirect(307, '/login')
	}

	const username = params.username.trim()
	const url = PUBLIC_POCKETBASE_URL

	const userData: PbListResponse<User> = await fetchJson(
		`${url}/api/collections/user/records?filter=(username="${username}")`,
		token,
		fetch
	)
	const user = userData.items[0]

	if (!user || username === 'script_user') {
		throw error(404, 'User not found')
	}

	const [averagePoints, predictionAccuracy, overallRank, drawResults]: [
		AveragePoints,
		PredictionAccuracy,
		OverallRank,
		PbListResponse<DrawResult>
	] = await Promise.all([
		fetchJson(`${url}/api/collections/average_points/records/${user.id}_avg`, token, fetch),
		fetchJson(`${url}/api/collections/prediction_accuracy/records/${user.id}_acc`, token, fetch),
		fetchJson(`${url}/api/collections/overall_leaderboard/records/${user.id}_rank`, token, fetch),
		fetchJson(
			`${url}/api/collections/draw_results/records?perPage=255&filter=(user_id="${user.id}")&sort=-draw_end_date,draw_event`,
			token,
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
