import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { OverallRank, PbListResponse } from '$lib/types'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Page from './+page.svelte'

const data: PbListResponse<OverallRank> = {
	page: 1,
	perPage: 100,
	totalItems: 3,
	totalPages: 1,
	items: [
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'overall_leaderboard',
			id: 'j5mehm6fvdf9105',
			user_id: 'zpjgxcf4d9ojqcd',
			username: 'will',
			total_points: 159,
			rank: 1
		},
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'overall_leaderboard',
			id: 'j5mehm6fvdf9105',
			user_id: 'zpjgxcf4d9ojqcd',
			username: 'bob',
			total_points: 132,
			rank: 2
		},
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'overall_leaderboard',
			id: 'j5mehm6fvdf9105',
			user_id: 'zpjgxcf4d9ojqcd',
			username: 'joe',
			total_points: 100,
			rank: 3
		}
	]
}

describe('Overall ranking page component', () => {
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
	})
})
