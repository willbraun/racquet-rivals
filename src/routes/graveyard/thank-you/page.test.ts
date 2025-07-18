import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Page from './+page.svelte'
import { page } from '$app/state'
import { currentUser } from '$lib/store'
import { PlanName } from '$lib/types'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import type { UserRecord } from '$lib/types'

// Mock $app/navigation
vi.mock('$app/navigation', () => ({
	replaceState: vi.fn()
}))

// Mock $app/state to control page.url.searchParams
vi.mock('$app/state', async () => {
	// This is to avoid mocking of other logic implemented in $app/state,
	// can be omitted if you don't care about it.
	const original = await vi.importActual('$app/state')

	return {
		...original,
		page: {
			url: {
				searchParams: new URLSearchParams()
			}
		}
	}
})

describe('Thank you page', () => {
	const testUser = {
		collectionId: '_pb_users_auth_' as const,
		collectionName: 'user' as const,
		avatar: '',
		id: 'testuser123',
		username: 'testuser',
		emailVisibility: true,
		grandfathered: false,
		paddle_customer_id: '',
		created: '2024-05-02 15:42:20.397Z',
		updated: '2024-05-02 15:42:20.397Z'
	} as UserRecord

	beforeEach(() => {
		// Reset mocks and stores
		vi.resetAllMocks()
		currentUser.set(testUser)

		// Mock page.url.searchParams to make it work with the URL parameter pattern
		page.url = {
			searchParams: {
				get: vi.fn().mockImplementation((key) => {
					if (key === 'plan') return 'none'
					if (key === 'mensDrawSlug') return ''
					if (key === 'womensDrawSlug') return ''
					return null
				})
			} as unknown as URLSearchParams
		} as unknown as URL
	})

	test('Displays thank you message with username', () => {
		render(PageSetup, {
			props: {
				component: Page
			}
		})
		expect(screen.getByText("Thank you testuser, you're in!")).toBeInTheDocument()
	})

	test('Displays generic order text when plan is none', () => {
		render(PageSetup, {
			props: {
				component: Page
			}
		})
		expect(
			screen.getByText(
				'Your order has been successfully processed. You will receive a confirmation email shortly.'
			)
		).toBeInTheDocument()
	})

	describe("Men's plan", () => {
		beforeEach(() => {
			page.url.searchParams.get = vi.fn().mockImplementation((key) => {
				if (key === 'plan') return PlanName.MEN
				if (key === 'mensDrawSlug') return 'us-open-mens-singles-2025-drawId123'
				if (key === 'womensDrawSlug') return 'us-open-womens-singles-2025-drawId456'
				return null
			})
		})

		test("Displays men's draw order text", () => {
			render(PageSetup, {
				props: {
					component: Page
				}
			})
			expect(
				screen.getByText(
					"Your Men's Draw order has been successfully processed. You will receive a confirmation email shortly."
				)
			).toBeInTheDocument()
		})

		test("Displays only men's draw button", () => {
			render(PageSetup, {
				props: {
					component: Page
				}
			})
			expect(
				screen.getByRole('button', { name: "Continue to US Open Men's Singles 2025" })
			).toBeInTheDocument()
			expect(
				screen.queryByRole('button', { name: "Continue to US Open Women's Singles 2025" })
			).not.toBeInTheDocument()
		})
	})

	describe("Women's plan", () => {
		beforeEach(() => {
			page.url.searchParams.get = vi.fn().mockImplementation((key) => {
				if (key === 'plan') return PlanName.WOMEN
				if (key === 'mensDrawSlug') return 'us-open-mens-singles-2025-drawId123'
				if (key === 'womensDrawSlug') return 'us-open-womens-singles-2025-drawId456'
				return null
			})
		})

		test("Displays women's draw order text", () => {
			render(PageSetup, {
				props: {
					component: Page
				}
			})
			expect(
				screen.getByText(
					"Your Women's Draw order has been successfully processed. You will receive a confirmation email shortly."
				)
			).toBeInTheDocument()
		})

		test("Displays only women's draw button", () => {
			render(PageSetup, {
				props: {
					component: Page
				}
			})
			expect(
				screen.queryByRole('button', { name: "Continue to US Open Men's Singles 2025" })
			).not.toBeInTheDocument()
			expect(
				screen.getByRole('button', { name: "Continue to US Open Women's Singles 2025" })
			).toBeInTheDocument()
		})
	})

	describe('Both plan', () => {
		beforeEach(() => {
			page.url.searchParams.get = vi.fn().mockImplementation((key) => {
				if (key === 'plan') return PlanName.BOTH
				if (key === 'mensDrawSlug') return 'wimbledon-mens-singles-2025-drawId789'
				if (key === 'womensDrawSlug') return 'wimbledon-womens-singles-2025-drawId012'
				return null
			})
		})

		test('Displays both draws order text', () => {
			render(PageSetup, {
				props: {
					component: Page
				}
			})
			expect(
				screen.getByText(
					'Your order of both draws has been successfully processed. You will receive a confirmation email shortly.'
				)
			).toBeInTheDocument()
		})

		test('Displays buttons for both draws', () => {
			render(PageSetup, {
				props: {
					component: Page
				}
			})
			expect(
				screen.getByRole('button', { name: "Continue to Wimbledon Men's Singles 2025" })
			).toBeInTheDocument()
			expect(
				screen.getByRole('button', { name: "Continue to Wimbledon Women's Singles 2025" })
			).toBeInTheDocument()
		})
	})

	describe('Subscription plan', () => {
		beforeEach(() => {
			page.url.searchParams.get = vi.fn().mockImplementation((key) => {
				if (key === 'plan') return PlanName.SUBSCRIPTION
				if (key === 'mensDrawSlug') return 'australian-open-mens-singles-2025-drawId345'
				if (key === 'womensDrawSlug') return 'australian-open-womens-singles-2025-drawId678'
				return null
			})
		})

		test('Displays subscription order text', () => {
			render(PageSetup, {
				props: {
					component: Page
				}
			})
			expect(
				screen.getByText(
					'Your subscription order has been successfully processed. You will receive a confirmation email shortly.'
				)
			).toBeInTheDocument()
		})

		test('Displays buttons for both draws', () => {
			render(PageSetup, {
				props: {
					component: Page
				}
			})
			expect(
				screen.getByRole('button', { name: "Continue to Australian Open Men's Singles 2025" })
			).toBeInTheDocument()
			expect(
				screen.getByRole('button', { name: "Continue to Australian Open Women's Singles 2025" })
			).toBeInTheDocument()
		})
	})
})
