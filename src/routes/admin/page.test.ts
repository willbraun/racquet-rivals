import PageSetup from '$lib/components/PageSetup.test.svelte'
import { currentUser } from '$lib/store'
import type { AdminPageData, ScraperHealthCheck, UserRecord } from '$lib/types'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, test } from 'vitest'
import Page from './+page.svelte'

const mockAtpHealthCheck: ScraperHealthCheck = {
	collectionId: 'collection1',
	collectionName: 'scraper_health_check',
	id: 'atp123',
	created: '2024-01-15 10:00:00.000Z',
	updated: '2024-01-15 10:00:00.000Z',
	draw_type: 'atp',
	draw_url: 'https://www.atptour.com/en/scores/current/australian-open/580/draws',
	error: ''
}

const mockWtaHealthCheck: ScraperHealthCheck = {
	collectionId: 'collection1',
	collectionName: 'scraper_health_check',
	id: 'wta123',
	created: '2024-01-15 10:00:00.000Z',
	updated: '2024-01-15 10:00:00.000Z',
	draw_type: 'wta',
	draw_url: 'https://www.wtatennis.com/tournament/2024-australian-open-melbourne-australia-1004',
	error: ''
}

const mockAdminPageData: AdminPageData = {
	atpHealth: mockAtpHealthCheck,
	wtaHealth: mockWtaHealthCheck,
	title: 'Scraper Health Status',
	description: 'Admin panel displaying the health status of ATP and WTA scrapers.'
}

const testAdminUser: UserRecord = {
	collectionId: '_pb_users_auth_',
	collectionName: 'user',
	avatar: '',
	id: 'admin123',
	username: 'admin',
	role: 'admin',
	emailVisibility: true,
	created: '2024-05-02 15:42:20.397Z',
	updated: '2024-05-02 15:42:20.397Z'
}

describe('Admin page component', () => {
	beforeEach(() => {
		currentUser.set(testAdminUser)
	})

	test('Renders with health data', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data: mockAdminPageData
			}
		})

		expect(screen.getByText('Admin')).toBeInTheDocument()
		expect(screen.getByText('Scraper Health Status')).toBeInTheDocument()
		expect(screen.getByText('ATP Draw')).toBeInTheDocument()
		expect(screen.getByText('WTA Draw')).toBeInTheDocument()
	})

	test('Renders with null health data', () => {
		const emptyData: AdminPageData = {
			atpHealth: null,
			wtaHealth: null,
			title: 'Scraper Health Status',
			description: 'Admin panel displaying the health status of ATP and WTA scrapers.'
		}

		render(PageSetup, {
			props: {
				component: Page,
				data: emptyData
			}
		})

		expect(screen.getByText('Admin')).toBeInTheDocument()
		expect(screen.getByText('Scraper Health Status')).toBeInTheDocument()
		expect(screen.getByText('ATP Draw')).toBeInTheDocument()
		expect(screen.getByText('WTA Draw')).toBeInTheDocument()
	})
})
