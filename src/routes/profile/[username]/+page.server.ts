import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
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
	if (!locals.pb.authStore.token) {
		redirect(307, '/login')
	}

	const username = params.username.trim()
	const url = PUBLIC_POCKETBASE_URL
	const options = {
		headers: {
			Authorization: locals.pb.authStore.token
		}
	}

	const userRes = await fetch(
		`${url}/api/collections/user/records?filter=(username="${username}")`,
		options
	)
	const userData: PbListResponse<User> = await userRes.json()
	const user = userData.items[0]

	if (!user || username === 'script_user') {
		throw error(404, 'User not found')
	}

	const [averagePointsRes, predictionAccuracyRes, overallRankRes, drawResultRes] =
		await Promise.all([
			fetch(`${url}/api/collections/average_points/records/${user.id}_avg`, options),
			fetch(`${url}/api/collections/prediction_accuracy/records/${user.id}_acc`, options),
			fetch(`${url}/api/collections/overall_leaderboard/records/${user.id}_rank`, options),
			fetch(
				`${url}/api/collections/draw_results/records?perPage=255&filter=(user_id="${user.id}")&sort=-draw_end_date,draw_event`,
				options
			)
		])

	const [averagePoints, predictionAccuracy, overallRank, drawResults]: [
		AveragePoints,
		PredictionAccuracy,
		OverallRank,
		PbListResponse<DrawResult>
	] = await Promise.all([
		averagePointsRes.json(),
		predictionAccuracyRes.json(),
		overallRankRes.json(),
		drawResultRes.json()
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
