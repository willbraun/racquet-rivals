export interface PbListResponse<T> {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: T[]
}

export interface Draw {
	collectionId: string
	collectionName: 'draw'
	created: string
	end_date: string
	event: "Men's Singles" | "Women's Singles"
	id: string
	name: string
	prediction_close: string
	size: number
	start_date: string
	updated: string
	url: string
	year: number
}

export interface Slot {
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

export interface Prediction {
	collectionId: string
	collectionName: 'view_predictions'
	draw_id: string
	draw_slot_id: string
	round: number
	position: number
	seed: string
	id: string
	name: string
	points: number
	user_id: string
	username: string
}

export interface PredictionRecord {
	collectionId: string
	collectionName: 'prediction'
	created: string
	draw_slot_id: string
	id: string
	name: string
	points: number
	updated: string
	user_id: string
}

export interface Leaderboard {
	collectionId: string
	collectionName: 'draw_leaderboard'
	draw_id: string
	id: string
	total_points: number
	user_id: string
	username: string
}

export interface SelectedUser {
	selectorId: string
	id: string
	username: string
	color: string
}

export interface AuthResult {
	data: {
		error: string
	}
	status: number
	type: string
}

export interface SelectUserResult {
	data: {
		user: SelectedUser
		error: string
	}
	status: number
	type: string
}

export interface DeselectUserResult {
	data: {
		deletedId: string
		error: string
	}
	status: number
	type: string
}

export interface AddPredictionResult {
	data: {
		record: PredictionRecord
		error: string
	}
	status: number
	type: string
}

declare global {
	interface SvelteFetch {
		(url: string, init?: RequestInit): Promise<Response>
	}
}

export interface HomePageData {
	active: PbListResponse<Draw>
	completed: PbListResponse<Draw>
	pb_auth_valid: boolean
	pb_auth_cookie: string
	pb_auth_username: string
}

export interface DrawPageData {
	active: PbListResponse<Draw>
	completed: PbListResponse<Draw>
	draw: Draw
	slots: PbListResponse<Slot>
	leaderboard: PbListResponse<Leaderboard>
	currentUser: SelectedUser
	pb_auth_valid: boolean
	pb_auth_cookie: string
	isLeaderboard: string
}
