export async function load({ fetch }) {
	const todayDate = new Date()
	const year = todayDate.getFullYear()
	const month = String(todayDate.getMonth() + 1).padStart(2, '0')
	const day = String(todayDate.getDate()).padStart(2, '0')
	const today = `${year}-${month}-${day}`

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
		completed: completedData
	}
}
