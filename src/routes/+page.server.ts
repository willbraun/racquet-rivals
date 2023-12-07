import { format } from 'date-fns'

export async function load({ fetch, locals }) {
	const today = format(new Date(), 'yyyy-mm-dd')

	const activeRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records?filter=(end_date>="${today}")`
	)
	const activeData = await activeRes.json()

	const completedRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records?filter=(end_date<"${today}")`
	)
	const completedData = await completedRes.json()

	return {
		active: activeData,
		completed: completedData,
		isAuthServer: locals.pb.authStore.isValid,
		pb_auth_cookie: locals.pb.authStore.exportToCookie()
	}
}
