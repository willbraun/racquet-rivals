import { format } from 'date-fns'

export async function load({ fetch, cookies }) {
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
		pb_auth: cookies.get('pb_auth')
	}
}
