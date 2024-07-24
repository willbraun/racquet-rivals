import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import Pocketbase from 'pocketbase'
import type { PbListResponse, Prediction, SelectedUser } from './types'
import { predictionStore } from './store'

export const updatePredictions = async (
	pb: Pocketbase,
	drawId: string,
	allUsers: SelectedUser[]
) => {
	const allUserIds = allUsers.map((user) => user.id)
	const userFilter = allUserIds.map((id) => `user_id="${id}"`).join('||')
	const filter = `(draw_id="${drawId}" && (${userFilter}))`
	const encoded = encodeURIComponent(filter)

	const options = {
		headers: {
			Authorization: pb.authStore.token
		}
	}

	const predictionRes = await fetch(
		`${PUBLIC_POCKETBASE_URL}/api/collections/view_predictions/records?perPage=300&filter=${encoded}`,
		options
	)
	const predictionData: PbListResponse<Prediction> = await predictionRes.json()
	predictionStore.set(predictionData.items)
}
