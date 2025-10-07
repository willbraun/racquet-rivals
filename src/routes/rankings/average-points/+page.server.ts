import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { AveragePoints, PbListResponse, RankingsPageData } from '$lib/types.js'
import { rankingDescriptions } from '../../../lib/data'

export async function load({ fetch }) {
	const url = PUBLIC_POCKETBASE_URL

	const averagePoints: PbListResponse<AveragePoints> = await fetchJson(
		`${url}/api/collections/average_points/records?perPage=100`,
		fetch
	)

	return {
		rankings: averagePoints,
		title: 'Average Points',
		description: rankingDescriptions.averagePoints
	} as RankingsPageData<AveragePoints>
}
