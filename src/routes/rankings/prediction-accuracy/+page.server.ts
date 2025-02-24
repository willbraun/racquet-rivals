import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { PbListResponse, PredictionAccuracy } from '$lib/types.js'

export async function load({ fetch }) {
	const url = PUBLIC_POCKETBASE_URL

	const predictionAccuracy: PbListResponse<PredictionAccuracy> = await fetchJson(
		`${url}/api/collections/prediction_accuracy/records?perPage=100`,
		fetch
	)

	return predictionAccuracy
}
