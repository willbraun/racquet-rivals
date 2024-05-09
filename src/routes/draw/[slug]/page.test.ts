import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { Draw, DrawPageData, PbListResponse, Prediction, SelectedUser, Slot } from '$lib/types'
import slotData from '$lib/testing/data/slot_data.json'
import DrawPageSetup from '$lib/testing/components/DrawPageSetup.svelte'

const data = {
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
	draw: {
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
	} as Draw,
	slots: slotData as PbListResponse<Slot>,
	predictions: {
		items: [],
		page: 1,
		perPage: 300,
		totalItems: 0,
		totalPages: 0
	} as PbListResponse<Prediction>,
	currentUser: {
		id: 'userId',
		username: 'will',
		color: 'bg-blue-300'
	} as SelectedUser,
	selectedUsers: [] as SelectedUser[],
	pb_auth_valid: true,
	pb_auth_cookie: 'dummy_cookie'
} as DrawPageData

describe('Draw page component', () => {
	test('Renders', () => {
		render(DrawPageSetup, { props: { data } })

		expect(screen.getByText('Round of 16')).toBeInTheDocument()
	})
})
