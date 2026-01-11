import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { AdminPageData, PbListResponse, ScraperHealthCheck } from '$lib/types.js'
import { error } from '@sveltejs/kit'

export async function load({ locals, fetch }) {
	if (locals.pb.authStore.record?.role !== 'admin') {
		throw error(403, 'Access denied. Admin privileges required.')
	}

	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token

	const atpHealthResponse: PbListResponse<ScraperHealthCheck> = await fetchJson(
		`${url}/api/collections/scraper_health_check/records?filter=(draw_type='atp')&sort=-created&perPage=1`,
		fetch,
		token
	)

	const wtaHealthResponse: PbListResponse<ScraperHealthCheck> = await fetchJson(
		`${url}/api/collections/scraper_health_check/records?filter=(draw_type='wta')&sort=-created&perPage=1`,
		fetch,
		token
	)

	return {
		atpHealth: atpHealthResponse?.items?.[0] || null,
		wtaHealth: wtaHealthResponse?.items?.[0] || null,
		title: 'Scraper Health Status'
	} as AdminPageData
}
