import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type {
	PbListResponse,
	PredictionDistribution,
	SelectedUser,
	ViewPredictionRecord
} from './types'

export const getPredictions = async (drawId: string, allUsers: SelectedUser[], token: string) => {
	const allUserIds = allUsers.map((user) => user.id)
	const userFilter = allUserIds.map((id) => `user_id="${id}"`).join('||')
	const filter = `(draw_id="${drawId}" && (${userFilter}))`
	const encoded = encodeURIComponent(filter)

	const options = {
		headers: {
			Authorization: token
		}
	}

	const predictionRes = await fetch(
		`${PUBLIC_POCKETBASE_URL}/api/collections/view_predictions/records?perPage=300&filter=${encoded}`,
		options
	)
	const predictionData: PbListResponse<ViewPredictionRecord> = await predictionRes.json()
	return predictionData
}

export const getPredictionDistribution = async (drawId: string, token: string) => {
	const filter = `(draw_id="${drawId}")`
	const encoded = encodeURIComponent(filter)

	const options = {
		headers: {
			Authorization: token
		}
	}

	// Maximum unique predictions across all slots is 64.
	// - Quarterfinals - Winners of 8 rounds with 2 choices = 16
	// - Semifinals - Winners of 4 rounds of 4 choices = 16
	// - Finals - Winners of 2 rounds of 8 choices = 16
	// - Champion - Winner of 1 round of 16 choices = 16
	// Total = 16 + 16 + 16 + 16 = 64 unique slot-predictions possible.
	const res = await fetch(
		`${PUBLIC_POCKETBASE_URL}/api/collections/prediction_distribution/records?perPage=64&filter=${encoded}`,
		options
	)
	const predictionDistribution: PbListResponse<PredictionDistribution> = await res.json()
	return predictionDistribution
}
