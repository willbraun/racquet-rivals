import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type {
	AveragePoints,
	OverallRank,
	PbListResponse,
	PredictionAccuracy,
	RankingsPageData
} from '$lib/types.js'
import { redirect } from '@sveltejs/kit'

export async function load({ fetch, locals }) {
	const token = locals.pb.authStore.token
	if (!token) {
		redirect(307, '/login')
	}

	const url = PUBLIC_POCKETBASE_URL

	const [overallRank, averagePoints, predictionAccuracy]: [
		PbListResponse<OverallRank>,
		PbListResponse<AveragePoints>,
		PbListResponse<PredictionAccuracy>
	] = await Promise.all([
		fetchJson(`${url}/api/collections/overall_leaderboard/records`, token, fetch),
		fetchJson(`${url}/api/collections/average_points/records`, token, fetch),
		fetchJson(`${url}/api/collections/prediction_accuracy/records`, token, fetch)
	])

	return {
		overallRank,
		averagePoints,
		predictionAccuracy
	} as RankingsPageData
}
