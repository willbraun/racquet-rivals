// Constants
export const Events = {
	MENS_SINGLES: "Men's Singles",
	WOMENS_SINGLES: "Women's Singles"
} as const
export type Event = (typeof Events)[keyof typeof Events]

export const TournamentName = {
	AUSTRALIAN_OPEN: 'Australian Open',
	FRENCH_OPEN: 'French Open',
	WIMBLEDON: 'Wimbledon',
	US_OPEN: 'US Open'
} as const

export type TournamentName = (typeof TournamentName)[keyof typeof TournamentName]

export const DrawStatus = {
	UPCOMING: 'upcoming',
	ACTIVE: 'active',
	COMPLETED: 'completed'
} as const
export type DrawStatus = (typeof DrawStatus)[keyof typeof DrawStatus]

// Pocketbase API types
export interface PbListResponse<T> {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: T[]
}

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
	collectionName: 'slots_with_scores'
	created: string
	draw_id: string
	id: string
	name: string
	position: number
	round: number
	seed: string
	updated: string
	set1_id: string | null
	set1_games: number | null
	set1_tiebreak: number | null
	set2_id: string | null
	set2_games: number | null
	set2_tiebreak: number | null
	set3_id: string | null
	set3_games: number | null
	set3_tiebreak: number | null
	set4_id: string | null
	set4_games: number | null
	set4_tiebreak: number | null
	set5_id: string | null
	set5_games: number | null
	set5_tiebreak: number | null
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

export interface DrawResult {
	collectionId: string
	collectionName: 'draw_results'
	id: string
	draw_id: string
	draw_name: string
	draw_event: Event
	draw_year: number
	draw_start_date: string
	draw_end_date: string
	user_id: string
	username: string
	total_points: number
	rank: number
	prediction_count: number
}

export interface AveragePoints {
	collectionId: string
	collectionName: 'average_points'
	id: string
	user_id: string
	username: string
	avg_points_per_draw: number | null
	rank: number | null
	percentile: number | null
	draws_played: number
}

export interface PredictionAccuracy {
	collectionId: string
	collectionName: 'prediction_accuracy'
	id: string
	user_id: string
	username: string
	correct: number
	total: number
	percent_correct: number | null
	rank: number | null
	percentile: number | null
}

export interface OverallRank {
	collectionId: string
	collectionName: 'overall_leaderboard'
	id: string
	user_id: string
	username: string
	total_points: number
	rank: number
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

// Custom types
export interface SelectedUserNoColor {
	selectorId: string
	id: string
	username: string
}

export interface SelectedUser extends SelectedUserNoColor {
	color: string
}

declare global {
	interface SvelteFetch {
		(url: string, init?: RequestInit): Promise<Response>
	}
}

export interface RootLayoutData {
	pb_auth_valid: boolean
	pb_auth_cookie: string
	pb_auth_username: string
	defaultDraw: Draw
}

export interface HomePageData {
	active: PbListResponse<Draw>
	completed: PbListResponse<Draw>
	banner: Banner
}

export interface DrawPageData {
	active: PbListResponse<Draw>
	completed: PbListResponse<Draw>
	draw: Draw
	slots: Slot[]
	drawResults: PbListResponse<DrawResult>
	// predictions: PbListResponse<Prediction>
	// selectedUsersFromCurrentUser: SelectedUser[]
	currentUser: SelectedUser
	isLeaderboard: string
}

export interface ProfilePageData {
	username: string
	created: string
	averagePoints: AveragePoints
	predictionAccuracy: PredictionAccuracy
	overallRank: OverallRank
	drawResults: PbListResponse<DrawResult>
}
