import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { rankingDescriptions } from '$lib/data'
import { fetchJson } from '$lib/server/utils.js'
import type { OverallRank, PbListResponse, RankingsPageData } from '$lib/types.js'

export async function load({ fetch }) {
	const url = PUBLIC_POCKETBASE_URL

	const overallRank: PbListResponse<OverallRank> = await fetchJson(
		`${url}/api/collections/overall_leaderboard/records?perPage=100`,
		fetch
	)

	return {
		rankings: overallRank,
		title: 'Overall Rankings',
		description: rankingDescriptions.overall
	} as RankingsPageData<OverallRank>
}
