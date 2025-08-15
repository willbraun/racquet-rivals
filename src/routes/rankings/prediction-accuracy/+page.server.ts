import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { PbListResponse, PredictionAccuracy, RankingsPageData } from '$lib/types.js'
import { rankingDescriptions } from '../../../lib/data'

export async function load({ fetch }) {
	const url = PUBLIC_POCKETBASE_URL

	const predictionAccuracy: PbListResponse<PredictionAccuracy> = await fetchJson(
		`${url}/api/collections/prediction_accuracy/records?perPage=100`,
		fetch
	)

	return {
		rankings: predictionAccuracy,
		title: 'Prediction Accuracy',
		description: rankingDescriptions.predictionAccuracy
	} as RankingsPageData<PredictionAccuracy>
}
