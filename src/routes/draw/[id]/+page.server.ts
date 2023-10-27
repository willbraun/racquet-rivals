export async function load({ fetch, params }) {
	interface Draw {
		collectionId: string
		collectionName: 'draw'
		created: string
		end_date: string
		event: 'Mens Singles' | 'Womens Singles'
		id: string
		name: string
		prediction_close: string
		size: number
		start_date: string
		updated: string
		url: string
		year: number
	}

	interface Slot {
		collectionId: string
		collectionName: 'draw_slot'
		created: string
		draw_id: string
		id: string
		name: string
		position: number
		round: number
		seed: string
		updated: string
	}

	interface SlotRes {
		page: number
		perPage: number
		totalItems: number
		totalPages: number
		items: Slot[]
	}

	const drawRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records/${params.id}`
	)
	const drawData: Draw = await drawRes.json()

	const slotRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${params.id}")`
	)
	const slotData: SlotRes = await slotRes.json()

	console.log(drawData)
	console.log(slotData)

	return {
		draw: drawData,
		slots: slotData
	}
}
