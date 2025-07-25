import type { RecordModel } from 'pocketbase'

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

export const PlanName = {
	MEN: 'men',
	WOMEN: 'women',
	BOTH: 'both',
	SUBSCRIPTION: 'subscription'
}
export type PlanName = (typeof PlanName)[keyof typeof PlanName]

export const UserAccess = {
	GRANDFATHERED: 'grandfathered',
	SUBSCRIPTION: PlanName.SUBSCRIPTION,
	MEN: PlanName.MEN,
	WOMEN: PlanName.WOMEN,
	BOTH: PlanName.BOTH,
	NONE: 'none',
	LOGGED_OUT: 'loggedOut'
}
export type UserAccess = (typeof UserAccess)[keyof typeof UserAccess]

// Pocketbase API types
export interface PbListResponse<T> {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: T[]
}

export interface UserRecord extends RecordModel {
	collectionId: '_pb_users_auth_'
	collectionName: 'user'
	avatar: string
	id: string
	username: string
	emailVisibility: boolean
	grandfathered: boolean
	paddle_customer_id: string
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

export interface ViewPredictionRecord {
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

export interface Prediction extends ViewPredictionRecord {
	color: string
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

export interface Subscription {
	collectionId: string
	collectionName: 'subscription'
	id: string
	user_id: string
	paddle_subscription_id: string
	status: string
	current_billing_period_start: string
	current_billing_period_end: string
	created: string
	updated: string
}

export interface DrawEntry {
	collectionId: string
	collectionName: 'entries_with_draw'
	id: string
	user_id: string
	draw_id: string
	created: string
	name: TournamentName
	event: Event
	year: number
	start_date: string
	end_date: string
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

export interface SelectedUserWithPoints extends SelectedUser {
	points: number
}

declare global {
	interface SvelteFetch {
		(url: string, init?: RequestInit): Promise<Response>
	}
}

export interface RootLayoutData {
	cookieCurrentUser: UserRecord
	defaultDraw: Draw
}

export interface HomePageData {
	upcoming: Draw[]
	active: Draw[]
	completed: Draw[]
}

export interface DrawPageData {
	upcoming: Draw[]
	active: Draw[]
	completed: Draw[]
	draw: Draw
	activeRound: string
	slots: Slot[]
	drawResults: PbListResponse<DrawResult>
	isLeaderboard: boolean
}

export interface ProfilePageData {
	username: string
	created: string
	averagePoints: AveragePoints
	predictionAccuracy: PredictionAccuracy
	overallRank: OverallRank
	drawResults: PbListResponse<DrawResult>
}

export interface PricingPageData {
	mensDraw: Draw
	womensDraw: Draw
	userAccess: UserAccess
}

export interface MyAccountPageData {
	user: UserRecord
	subscription: Subscription | null
	entries: DrawEntry[]
	paddleCustomerPortalUrl: string
}

export interface SelectedPlan {
	plan: string
	title: string
}

export interface DrawAccess {
	hasAccess: boolean
}
