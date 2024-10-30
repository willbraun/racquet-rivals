import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import type { PbListResponse, AveragePoints } from '$lib/types.js'
import { redirect } from '@sveltejs/kit'

export async function load({ fetch, locals }) {
	const token = locals.pb.authStore.token
	if (!token) {
		redirect(307, '/')
	}

	const url = PUBLIC_POCKETBASE_URL

	const averagePoints: PbListResponse<AveragePoints> = await fetchJson(
		`${url}/api/collections/average_points/records?perPage=100`,
		token,
		fetch
	)

	return averagePoints
}
