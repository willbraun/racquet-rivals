export interface Draw {
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

interface Prediction {
	collectionId: string
	collectionName: 'view_predictions'
	draw_id: string
	draw_slot_id: string
	id: string
	user_id: string
	username: string
}

interface PredictionRes {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: Prediction[]
}

export async function load({ fetch, params }) {
	const id = params.slug.split('-').at(-1)

	const drawRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw/records/${id}`
	)
	const drawData: Draw = await drawRes.json()

	const slotRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/draw_slot/records?perPage=255&filter=(draw_id="${id}")`
	)
	const slotData: SlotRes = await slotRes.json()

	const filter = `(draw_id="${id}" && user_id="gvi2dlpb8gltpvo")`
	const encoded = encodeURIComponent(filter)
	const predictionRes = await fetch(
		`https://tennisbracket.willbraun.dev/api/collections/view_predictions/records?perPage=300&filter=${encoded}`
	)
	const predictionData: PredictionRes = await predictionRes.json()

	return {
		draw: drawData,
		slots: slotData,
		predictions: predictionData
	}
}
