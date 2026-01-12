import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { Draw, PbListResponse, RootLayoutData, ScraperHealthCheck } from '$lib/types'
import { ScraperHealth } from '$lib/types'
import { scrapersHealthyWaitingErrors } from '../lib/data'

export async function load({ locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token

	let draws: PbListResponse<Draw>
	draws = await fetchJson(
		`${url}/api/collections/draw/records?filter=(end_date>=@now)&sort=start_date,event&perPage=1`,
		fetch,
		token
	)

	if (draws.items.length === 0) {
		draws = await fetchJson(
			`${url}/api/collections/draw/records?sort=-end_date,event&perPage=1`,
			fetch,
			token
		)
	}

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

	const atpError = atpHealthResponse?.items?.[0].error || ''
	const wtaError = wtaHealthResponse?.items?.[0].error || ''
	const isAtpWaiting = scrapersHealthyWaitingErrors.some((err) => atpError.includes(err))
	const isAtpError = atpError && !isAtpWaiting
	const isWtaWaiting = scrapersHealthyWaitingErrors.some((err) => wtaError.includes(err))
	const isWtaError = wtaError && !isWtaWaiting

	let scrapersHealthy: ScraperHealth
	if (isAtpError || isWtaError) {
		scrapersHealthy = ScraperHealth.ERROR
	} else if (isAtpWaiting || isWtaWaiting) {
		scrapersHealthy = ScraperHealth.WAITING
	} else {
		scrapersHealthy = ScraperHealth.SUCCESS
	}

	return {
		cookieCurrentUser: locals.pb.authStore.record,
		defaultDraw: draws.items[0],
		scrapersHealthy
	} as RootLayoutData
}
