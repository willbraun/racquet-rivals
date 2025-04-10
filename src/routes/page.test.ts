import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { HomePageData } from '$lib/types'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import Page from './+page.svelte'
import { currentUser, isAuth } from '$lib/store'

// Mock the Intersection Observer
class IntersectionObserverMock {
	constructor(
		private callback: IntersectionObserverCallback,
		private options?: IntersectionObserverInit
	) {}

	observe(target: Element) {
		// No-op
	}

	unobserve(target: Element) {
		// No-op
	}

	disconnect() {
		// No-op
	}
}

// Mock the global IntersectionObserver
global.IntersectionObserver = IntersectionObserverMock as any

const data: HomePageData = {
	upcoming: [],
	active: [
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
	completed: [
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
		currentUser.set({
			collectionId: '_pb_users_auth_',
			collectionName: 'user',
			avatar: '',
			id: 'willId',
			username: 'will',
			emailVisibility: true,
			created: '2024-05-02 15:42:20.397Z',
			updated: '2024-05-02 15:42:20.397Z'
		})
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText(/Racquet\s*Rivals/i)).toBeInTheDocument()
		expect(screen.getByText('Welcome will!')).toBeInTheDocument()
		expect(screen.queryByText('Log in')).not.toBeInTheDocument()
		expect(screen.queryByText('Sign up')).not.toBeInTheDocument()
		expect(screen.getByText('Log out')).toBeInTheDocument()
	})

	test('Logged out', () => {
		currentUser.set(null)
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		expect(screen.getByText(/Racquet\s*Rivals/i)).toBeInTheDocument()
		expect(screen.queryByText('Welcome will!')).not.toBeInTheDocument()
		expect(screen.getAllByText('Log in')).toHaveLength(2)
		expect(screen.getAllByText('Sign up')).toHaveLength(2)
		expect(screen.queryByText('Log out')).not.toBeInTheDocument()
	})
})
