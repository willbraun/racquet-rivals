import PageSetup from '$lib/components/PageSetup.test.svelte'
import type { AveragePoints, RankingsPageData } from '$lib/types'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import Page from './+page.svelte'

const data: RankingsPageData<AveragePoints> = {
	rankings: {
		page: 1,
		perPage: 100,
		totalItems: 4,
		totalPages: 1,
		items: [
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'average_points',
				id: 'j5mehm6fvdf9105',
				user_id: 'zpjgxcf4d9ojqcd',
				username: 'will',
				avg_points_per_draw: 20,
				rank: 1,
				percentile: 100,
				draws_played: 8
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'average_points',
				id: 'j5mehm6fvdf9106',
				user_id: 'zpjgxcf4d9ojqcd',
				username: 'bob',
				avg_points_per_draw: 15,
				rank: 2,
				percentile: 50,
				draws_played: 5
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'average_points',
				id: 'j5mehm6fvdf9107',
				user_id: 'zpjgxcf4d9ojqcd',
				username: 'joe',
				avg_points_per_draw: 10,
				rank: 3,
				percentile: 0,
				draws_played: 6
			},
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'average_points',
				id: 'j5mehm6fvdf9108',
				user_id: 'zpjgxcf4d9ojqcd',
				username: 'steve',
				avg_points_per_draw: null,
				rank: null,
				percentile: null,
				draws_played: 6
			}
		]
	},
	title: 'Average Points',
	description: 'View the average points per draw for each user.'
}

describe('Average points ranking page component', () => {
	test('Renders', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText('will')).toBeInTheDocument()
		expect(screen.getByText('bob')).toBeInTheDocument()
		expect(screen.getByText('joe')).toBeInTheDocument()
		expect(screen.getByText('steve')).toBeInTheDocument()
	})
})
