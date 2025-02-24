import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { PbListResponse, AveragePoints } from '$lib/types.js'

export async function load({ fetch, locals }) {
	const url = PUBLIC_POCKETBASE_URL

	const averagePoints: PbListResponse<AveragePoints> = await fetchJson(
		`${url}/api/collections/average_points/records?perPage=100`,
		fetch
	)

	return averagePoints
}
