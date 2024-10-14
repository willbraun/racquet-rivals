import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type {
	AveragePoints,
	OverallRank,
	PbListResponse,
	PredictionAccuracy,
	ProfilePageData,
	User
} from '$lib/types.js'
import { redirect } from '@sveltejs/kit'

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

	const [averagePointsRes, predictionAccuracyRes, overallRankRes] = await Promise.all([
		fetch(`${url}/api/collections/average_points/records/${user.id}_avg`, options),
		fetch(`${url}/api/collections/prediction_accuracy/records/${user.id}_acc`, options),
		fetch(`${url}/api/collections/overall_leaderboard/records/${user.id}_rank`, options)
	])

	const [averagePoints, predictionAccuracy, overallRank]: [
		AveragePoints,
		PredictionAccuracy,
		OverallRank
	] = await Promise.all([
		averagePointsRes.json(),
		predictionAccuracyRes.json(),
		overallRankRes.json()
	])

	return {
		username: user.username,
		created: user.created,
		averagePoints,
		predictionAccuracy,
		overallRank
	} as ProfilePageData
}
