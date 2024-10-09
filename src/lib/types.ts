export interface PbListResponse<T> {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: T[]
}

type Event = "Men's Singles" | "Women's Singles"
export type TournamentName = 'Australian Open' | 'French Open' | 'Wimbledon' | 'US Open'

export interface User {
	collectionId: '_pb_users_auth_'
	collectionName: 'user'
	avatar: string
	id: string
	username: string
	emailVisibility: boolean
	created: string
	updated: string
}

export interface Draw {
	collectionId: string
	collectionName: 'draw'
	created: string
	end_date: string
	event: Event
	id: string
	name: TournamentName
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
	rank: number
	total_points: number
	user_id: string
	username: string
}

export interface AveragePoints {
	collectionId: string
	collectionName: 'average_points'
	id: string
	user_id: string
	username: string
	avg_points_per_draw: number
	rank: number
	percentile: number
	draws_played: number
}

export interface CorrectPredictions {
	collectionId: string
	collectionName: 'correct_predictions'
	id: string
	user_id: string
	username: string
	correct: number
	total: number
	percent_correct: number
	rank: number
	percentile: number
}

export interface Banner {
	collectionId: string
	collectionName: 'banner'
	created: string
	id: string
	next_tournament: TournamentName
	start_date: string
	end_date: string
	updated: string
}

export interface SelectedUserNoColor {
	selectorId: string
	id: string
	username: string
}

export interface SelectedUser extends SelectedUserNoColor {
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
		user: SelectedUserNoColor
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
	banner: Banner
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
	predictions: PbListResponse<Prediction>
	cookieSelectedUsers: SelectedUser[]
	currentUser: SelectedUser
	pb_auth_valid: boolean
	pb_auth_cookie: string
	isLeaderboard: string
}

export interface ProfilePageData {
	username: string
	created: string
	averagePoints: AveragePoints
	correctPredictions: CorrectPredictions
}
