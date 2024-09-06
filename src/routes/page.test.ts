import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { Draw, HomePageData, PbListResponse } from '$lib/types'
import HomePageSetup from '$lib/testing/components/HomePageSetup.svelte'

const data: HomePageData = {
	active: {
		items: [
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw',
				created: '2024-05-02 15:42:20.397Z',
				end_date: '2024-06-09 23:00:00.000Z',
				event: "Men's Singles",
				id: 'j5mehm6fvdf9105',
				name: 'French Open',
				prediction_close: '',
				size: 128,
				start_date: '2024-05-26 12:00:00.000Z',
				updated: '2024-05-02 15:44:08.159Z',
				url: 'https://www.atptour.com/en/scores/archive/roland-garros/520/2024/draws',
				year: 2024
			}
		],
		page: 1,
		perPage: 30,
		totalItems: 1,
		totalPages: 1
	} as PbListResponse<Draw>,
	completed: {
		items: [
			{
				collectionId: 'zpjgxcf4d9ojqcd',
				collectionName: 'draw',
				created: '2024-05-02 15:42:20.397Z',
				end_date: '2024-06-09 23:00:00.000Z',
				event: "Men's Singles",
				id: '757duh3a8vpgyrq',
				name: 'Australian Open',
				prediction_close: '2024-01-28 05:32:34.187Z',
				size: 128,
				start_date: '2024-01-13 13:00:00.000Z',
				updated: '2024-01-27 19:47:22.187Z',
				url: 'https://www.atptour.com/en/scores/current/australian-open/580/draws',
				year: 2024
			}
		],
		page: 1,
		perPage: 30,
		totalItems: 1,
		totalPages: 1
	} as PbListResponse<Draw>,
	pb_auth_valid: true,
	pb_auth_cookie: 'dummy_cookie',
	pb_auth_username: 'will',
	banner: {
		collectionId: 'asvzq3z4d9ojqcd',
		collectionName: 'banner',
		created: '2024-05-02 15:42:20.397Z',
		id: 'j5mehm6fvdf9105',
		next_tournament: 'French Open',
		start_date: '2024-05-26 12:00:00.000Z',
		end_date: '2024-06-09 23:00:00.000Z',
		updated: '2024-05-02 15:44:08.159Z'
	}
}

describe('Home page component', () => {
	test('Logged in', () => {
		render(HomePageSetup, { props: { data } })

		expect(screen.getByText('Racquet Rivals')).toBeInTheDocument()
		expect(screen.getByText('Welcome will!')).toBeInTheDocument()
		expect(screen.getByText("French Open Men's Singles 2024")).toBeInTheDocument()
		expect(screen.getByText("Australian Open Men's Singles 2024")).toBeInTheDocument()
	})

	test('Logged in', () => {
		render(HomePageSetup, {
			props: {
				data: {
					...data,
					pb_auth_valid: false
				}
			}
		})

		expect(screen.getByText('Racquet Rivals')).toBeInTheDocument()
		expect(screen.queryByText('Welcome will!')).not.toBeInTheDocument()
		expect(screen.getByText("French Open Men's Singles 2024")).toBeInTheDocument()
		expect(screen.getByText("Australian Open Men's Singles 2024")).toBeInTheDocument()
	})
})
