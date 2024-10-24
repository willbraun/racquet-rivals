import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { PbListResponse, PredictionAccuracy } from '$lib/types.js'
import { redirect } from '@sveltejs/kit'

export async function load({ fetch, locals }) {
	const token = locals.pb.authStore.token
	if (!token) {
		redirect(307, '/login')
	}

	const url = PUBLIC_POCKETBASE_URL

	const predictionAccuracy: PbListResponse<PredictionAccuracy> = await fetchJson(
		`${url}/api/collections/prediction_accuracy/records?perPage=100`,
		token,
		fetch
	)

	return predictionAccuracy
}
