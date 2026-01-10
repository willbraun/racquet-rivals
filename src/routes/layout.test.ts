import type { Draw, RootLayoutData, UserRecord } from '$lib/types'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import Layout from './+layout.svelte'

const data: RootLayoutData = {
	cookieCurrentUser: {
		collectionId: '_pb_users_auth_',
		collectionName: 'user',
		avatar: '',
		id: 'willId',
		username: 'will',
		emailVisibility: true,
		created: '2024-05-02 15:42:20.397Z',
		updated: '2024-05-02 15:42:20.397Z'
	},
	defaultDraw: {
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
	} as Draw
}

describe('Root layout component', () => {
	test('Renders logged in', () => {
		render(Layout, { data })

		expect(screen.getByTestId('Footer')).toBeInTheDocument()
	})

	test('Renders logged out', () => {
		render(Layout, { data: { ...data, cookieCurrentUser: {} as UserRecord } })

		expect(screen.getByTestId('Footer')).toBeInTheDocument()
	})
})
