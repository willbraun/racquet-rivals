import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { DrawResult, PbListResponse, ProfilePageData } from '$lib/types'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Page from './+page.svelte'

const data: ProfilePageData = {
	username: 'will',
	created: '2024-05-02 15:42:20.397Z',
	averagePoints: {
		collectionId: 'zpjgxcf4d9ojqcd',
		collectionName: 'average_points',
		id: 'j5mehm6fvdf9105',
		user_id: 'zpjgxcf4d9ojqcd',
		username: 'will',
		avg_points_per_draw: 26.5,
		rank: 1,
		percentile: 100,
		draws_played: 6
	},
	predictionAccuracy: {
		collectionId: 'zpjgxcf4d9ojqcd',
		collectionName: 'prediction_accuracy',
		id: 'j5mehm6fvdf9105',
		user_id: 'zpjgxcf4d9ojqcd',
		username: 'will',
		correct: 5,
		total: 6,
		percent_correct: 83.33,
		rank: 1,
		percentile: 100
	},
	overallRank: {
		collectionId: 'zpjgxcf4d9ojqcd',
		collectionName: 'overall_leaderboard',
		id: 'j5mehm6fvdf9105',
		user_id: 'zpjgxcf4d9ojqcd',
		username: 'will',
		total_points: 159,
		rank: 1
	},
	drawResults: {
		items: [
			{
				collectionId: '1',
				collectionName: 'draw_results',
				id: 'draw1',
				draw_id: 'draw1',
				draw_name: 'Australian Open',
				draw_event: "Men's Singles",
				draw_year: 2024,
				draw_start_date: '2024-05-26',
				draw_end_date: '2024-06-09',
				user_id: 'zpjgxcf4d9ojqcd',
				username: 'will',
				total_points: 100,
				rank: 1,
				prediction_count: 15
			},
			{
				collectionId: '2',
				collectionName: 'draw_results',
				id: 'draw2',
				draw_id: 'draw2',
				draw_name: 'Australian Open',
				draw_event: "Women's Singles",
				draw_year: 2024,
				draw_start_date: '2024-01-15',
				draw_end_date: '2024-01-28',
				user_id: 'zpjgxcf4d9ojqcd',
				username: 'will',
				total_points: 59,
				rank: 2,
				prediction_count: 15
			}
		],
		page: 1,
		perPage: 30,
		totalItems: 2,
		totalPages: 1
	} as PbListResponse<DrawResult>
}

describe('Profile page component', () => {
	test('Renders', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText('will')).toBeInTheDocument()
	})
})
