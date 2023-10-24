export async function load({ fetch, params }) {
	const drawRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records/${params.id}`
	)
	const drawData = await drawRes.json()

	const slotRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw_slot/records?filter=(draw_id="${params.id}")`
	)
	const slotData = await slotRes.json()

	return {
		draw: drawData,
		slots: slotData
	}
}
