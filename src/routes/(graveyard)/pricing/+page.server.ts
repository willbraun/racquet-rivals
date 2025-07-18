import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { fetchJson } from '$lib/server/utils.js'
import {
	Events,
	UserAccess,
	type Draw,
	type PbListResponse,
	type PricingPageData,
	type UserRecord
} from '$lib/types'

export async function load({ locals }) {
	const url = PUBLIC_POCKETBASE_URL
	const token = locals.pb.authStore.token
	const userId = locals.pb.authStore.record?.id ?? ''

	const drawFilter = `(end_date>=@now && (prediction_close>=@now || prediction_close=null))`
	const draws: PbListResponse<Draw> = await fetchJson(
		`${url}/api/collections/draw/records?filter=${encodeURIComponent(drawFilter)}&sort=start_date,event,prediction_close&perPage=2`,
		fetch,
		token
	)

	let mensDraw: Draw | undefined
	let womensDraw: Draw | undefined

	for (const draw of draws.items) {
		if (draw.event === Events.MENS_SINGLES) {
			mensDraw = draw
		} else if (draw.event === Events.WOMENS_SINGLES) {
			womensDraw = draw
		}

		if (mensDraw && womensDraw) break
	}

	const getUserAccess = async (userId: string): Promise<UserAccess> => {
		if (!userId) {
			return UserAccess.LOGGED_OUT
		}

		const user: UserRecord = await fetchJson(
			`${url}/api/collections/user/records/${userId}`,
			fetch,
			token
		)

		if (user.grandfathered) {
			return UserAccess.GRANDFATHERED
		}

		const subscriptions = await fetchJson(
			`${url}/api/collections/subscription/records?filter=(user_id="${userId}")`,
			fetch,
			token
		)

		if (
			subscriptions.items?.length > 0 &&
			(subscriptions.items[0].status === 'active' || subscriptions.items[0].status === 'past_due')
		) {
			return UserAccess.SUBSCRIPTION
		}

		const mensFilter = `(draw_id="${mensDraw?.id}" && user_id="${userId}")`
		const mensDrawEntry = await fetchJson(
			`${url}/api/collections/user_draw_entry/records?filter=${encodeURIComponent(mensFilter)}`,
			fetch,
			token
		)

		const womensFilter = `(draw_id="${womensDraw?.id}" && user_id="${userId}")`
		const womensDrawEntry = await fetchJson(
			`${url}/api/collections/user_draw_entry/records?filter=${encodeURIComponent(womensFilter)}`,
			fetch,
			token
		)

		const mensHasEntry = mensDrawEntry.items?.length > 0
		const womensHasEntry = womensDrawEntry.items?.length > 0

		if (mensHasEntry && womensHasEntry) {
			return UserAccess.BOTH
		} else if (mensHasEntry) {
			return UserAccess.MEN
		} else if (womensHasEntry) {
			return UserAccess.WOMEN
		}

		return UserAccess.NONE
	}

	return {
		mensDraw,
		womensDraw,
		userAccess: await getUserAccess(userId)
	} as PricingPageData
}
