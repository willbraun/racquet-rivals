import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type { Draw, DrawPageData, PbListResponse, Slot } from '$lib/types'
import { fetchDraws, getCurrentUser } from '$lib/utils'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ fetch, params, locals }) => {
	const id: string = params.slug.split('-').at(-1) ?? ''
	const url = PUBLIC_POCKETBASE_URL
	const currentUser = getCurrentUser(locals)
	const options = {
		headers: {
			Authorization: locals.pb.authStore.token
		}
	}

	const [activeData, completedData] = await fetchDraws(fetch, url, locals.pb.authStore.token)

	const drawRes = await fetch(`${url}/api/collections/draw/records/${id}`, options)
	const drawData: Draw = await drawRes.json()

	const slotRes = await fetch(
		`${url}/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${id}")`,
		options
	)
	const slotData: PbListResponse<Slot> = await slotRes.json()

	return {
		active: activeData,
		completed: completedData,
		currentUser: currentUser,
		draw: drawData,
		slots: slotData,
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string
	} as DrawPageData
}
