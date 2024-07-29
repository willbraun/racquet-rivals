import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchDraws, getCurrentUser } from '$lib/utils'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	const url = PUBLIC_POCKETBASE_URL
	const currentUser = getCurrentUser(locals)

	const [activeData, completedData] = await fetchDraws(fetch, url, locals.pb.authStore.token)

	return {
		active: activeData,
		completed: completedData,
		currentUser: currentUser
	}
}
