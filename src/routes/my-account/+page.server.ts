import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { redirect } from '@sveltejs/kit'
import { fetchJson } from '$lib/server/utils'
import type {
	Draw,
	MyAccountPageData,
	PbListResponse,
	Subscription,
	DrawEntry,
	UserRecord
} from '$lib/types'

export async function load({ locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login')
	}

	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token
	const userId = locals.pb.authStore.record?.id ?? ''

	if (!userId) {
		throw redirect(303, '/login')
	}

	const user: UserRecord = await fetchJson(
		`${url}/api/collections/user/records/${userId}`,
		fetch,
		token
	)

	const subscriptions: PbListResponse<Subscription> = await fetchJson(
		`${url}/api/collections/subscription/records?filter=(user_id="${userId}")&sort=-created`,
		fetch,
		token
	)

	const entries: PbListResponse<DrawEntry> = await fetchJson(
		`${url}/api/collections/entries_with_draw/records?filter=(user_id="${userId}")&sort=-created`,
		fetch,
		token
	)

	return {
		user,
		subscription: subscriptions.items.length > 0 ? subscriptions.items[0] : null,
		entries: entries.items
	} as MyAccountPageData
}
