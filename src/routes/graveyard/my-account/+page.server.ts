import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { PADDLE_API_KEY, PADDLE_API_URL } from '$env/static/private'
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

	let paddleCustomerPortalUrl = ''
	if (user.paddle_customer_id) {
		try {
			const paddleCustomerPortalResponse = await fetch(
				`${PADDLE_API_URL}/customers/${user.paddle_customer_id}/portal-sessions`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${PADDLE_API_KEY}`
					}
				}
			)

			const paddleCustomerPortalData = await paddleCustomerPortalResponse.json()
			if (!paddleCustomerPortalResponse.ok) {
				console.error('Error fetching Paddle customer data:', paddleCustomerPortalData)
			}

			paddleCustomerPortalUrl = paddleCustomerPortalData?.data?.urls?.general?.overview || ''
		} catch (error) {
			console.error('Error fetching Paddle customer data:', error)
		}
	}

	return {
		user,
		subscription: subscriptions.items.length > 0 ? subscriptions.items[0] : null,
		entries: entries.items,
		paddleCustomerPortalUrl
	} as MyAccountPageData
}
