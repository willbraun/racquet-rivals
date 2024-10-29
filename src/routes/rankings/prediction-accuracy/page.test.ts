import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { AveragePoints, PbListResponse, PredictionAccuracy } from '$lib/types'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Page from './+page.svelte'

const data: PbListResponse<PredictionAccuracy> = {
	page: 1,
	perPage: 100,
	totalItems: 4,
	totalPages: 1,
	items: [
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'prediction_accuracy',
			id: 'j5mehm6fvdf9105',
			user_id: 'zpjgxcf4d9ojqcd',
			username: 'will',
			percent_correct: 80,
			rank: 1,
			percentile: 100,
			correct: 8,
			total: 10
		},
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'prediction_accuracy',
			id: 'j5mehm6fvdf9105',
			user_id: 'zpjgxcf4d9ojqcd',
			username: 'bob',
			percent_correct: 60,
			rank: 2,
			percentile: 50,
			correct: 6,
			total: 10
		},
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'prediction_accuracy',
			id: 'j5mehm6fvdf9105',
			user_id: 'zpjgxcf4d9ojqcd',
			username: 'joe',
			percent_correct: 20,
			rank: 3,
			percentile: 0,
			correct: 2,
			total: 10
		},
		{
			collectionId: 'zpjgxcf4d9ojqcd',
			collectionName: 'prediction_accuracy',
			id: 'j5mehm6fvdf9105',
			user_id: 'zpjgxcf4d9ojqcd',
			username: 'steve',
			percent_correct: null,
			rank: null,
			percentile: null,
			correct: 0,
			total: 0
		}
	]
}

describe('Prediction accuracy ranking page component', () => {
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
