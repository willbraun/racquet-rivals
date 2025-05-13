import { render, screen } from '@testing-library/svelte'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import Page from './+page.svelte'
import { Events, TournamentName, UserAccess } from '$lib/types'
import type { PricingPageData, Draw, UserRecord } from '$lib/types'
import PageSetup from '$lib/components/PageSetup.test.svelte'
import { currentUser } from '$lib/store'

vi.mock('$lib/utils', async (importOriginal) => {
	const actual = await importOriginal()
	return {
		...(actual as any),
		setupPaddle: vi.fn().mockResolvedValue({
			Checkout: { open: vi.fn() }
		})
	}
})

const mockMensDraw: Draw = {
	id: 'mens_draw_123',
	name: TournamentName.FRENCH_OPEN,
	year: 2025,
	event: Events.MENS_SINGLES,
	size: 128,
	start_date: '2025-05-25T00:00:00.000Z',
	end_date: '2025-06-08T00:00:00.000Z',
	prediction_close: '2025-05-24T23:59:59.000Z',
	url: 'https://example.com/mens-draw',
	created: '2025-01-01T00:00:00.000Z',
	updated: '2025-01-01T00:00:00.000Z',
	collectionId: 'draw_collection_id',
	collectionName: 'draw'
}

const mockWomensDraw: Draw = {
	...mockMensDraw,
	id: 'womens_draw_123',
	event: Events.WOMENS_SINGLES
}

const mockBasePricingPageData: PricingPageData = {
	mensDraw: mockMensDraw,
	womensDraw: mockWomensDraw,
	userAccess: UserAccess.NONE
}

const mockUser: UserRecord = {
	id: 'user123',
	username: 'testuser',
	email: 'test@example.com',
	avatar: '',
	created: '2025-01-01T00:00:00.000Z',
	updated: '2025-01-01T00:00:00.000Z',
	paddle_customer_id: 'cus_123',
	grandfathered: false,
	collectionId: '_pb_users_auth_',
	collectionName: 'user',
	emailVisibility: false
}

describe('Pricing Page', () => {
	beforeEach(() => {
		currentUser.set(mockUser)
	})

	afterEach(() => {
		currentUser.set(null)
		vi.clearAllMocks()
	})

	const getPlanMessage = (planTitle: string): string | null => {
		const planElement = screen.getByText(planTitle).closest('.relative.flex')
		if (!planElement) return null

		const message = planElement.querySelector('p.text-center.text-sm.text-gray-500')
		return message ? message.textContent : null
	}

	test('Renders all pricing plans when logged out', () => {
		currentUser.set(null)

		render(PageSetup, {
			props: {
				component: Page,
				data: mockBasePricingPageData
			}
		})

		expect(screen.getByText("Men's Draw")).toBeInTheDocument()
		expect(screen.getByText("Women's Draw")).toBeInTheDocument()
		expect(screen.getByText('Both Draws')).toBeInTheDocument()
		expect(screen.getByText('Full Access Subscription')).toBeInTheDocument()

		expect(screen.getAllByText('$4.99')).toHaveLength(2)
		expect(screen.getByText('$7.99')).toBeInTheDocument()
		expect(screen.getByText('$19.99/yr')).toBeInTheDocument()

		const selectButtons = screen.getAllByRole('button', { name: 'Select' })
		selectButtons.forEach((button) => {
			expect(button).not.toBeDisabled()
		})
		expect(screen.getByRole('button', { name: 'Get Started' })).not.toBeDisabled()

		expect(
			screen.getByText(
				"You'll be prompted to create an account and then taken to the payment page."
			)
		).toBeInTheDocument()
	})

	test('Renders all pricing plans when logged in with no access', () => {
		render(PageSetup, {
			props: {
				component: Page,
				data: mockBasePricingPageData
			}
		})

		expect(screen.getByText("Men's Draw")).toBeInTheDocument()
		expect(screen.getByText("Women's Draw")).toBeInTheDocument()
		expect(screen.getByText('Both Draws')).toBeInTheDocument()
		expect(screen.getByText('Full Access Subscription')).toBeInTheDocument()

		expect(screen.getAllByText('$4.99')).toHaveLength(2)
		expect(screen.getByText('$7.99')).toBeInTheDocument()
		expect(screen.getByText('$19.99/yr')).toBeInTheDocument()

		const selectButtons = screen.getAllByRole('button', { name: 'Select' })
		selectButtons.forEach((button) => {
			expect(button).not.toBeDisabled()
		})
		expect(screen.getByRole('button', { name: 'Get Started' })).not.toBeDisabled()
	})

	test("Disables Men's Draw and Both Draws when user already has Men's Draw access", () => {
		const data = { ...mockBasePricingPageData, userAccess: UserAccess.MEN }
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const mensButton = screen.getAllByRole('button', { name: 'Select' })[0]
		expect(mensButton).toBeDisabled()
		expect(getPlanMessage("Men's Draw")).toBe('You already have access to this draw.')

		const womensButton = screen.getAllByRole('button', { name: 'Select' })[1]
		expect(womensButton).not.toBeDisabled()

		const bothButton = screen.getAllByRole('button', { name: 'Select' })[2]
		expect(bothButton).toBeDisabled()
		expect(getPlanMessage('Both Draws')).toBe(
			"You already have access to the men's draw. You may purchase the women's draw as well."
		)

		const subscriptionButton = screen.getByRole('button', { name: 'Get Started' })
		expect(subscriptionButton).not.toBeDisabled()
	})

	test("Disables Women's Draw and Both Draws when user already has Women's Draw access", () => {
		const data = { ...mockBasePricingPageData, userAccess: UserAccess.WOMEN }
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const womensButton = screen.getAllByRole('button', { name: 'Select' })[1]
		expect(womensButton).toBeDisabled()
		expect(getPlanMessage("Women's Draw")).toBe('You already have access to this draw.')

		const mensButton = screen.getAllByRole('button', { name: 'Select' })[0]
		expect(mensButton).not.toBeDisabled()

		const bothButton = screen.getAllByRole('button', { name: 'Select' })[2]
		expect(bothButton).toBeDisabled()
		expect(getPlanMessage('Both Draws')).toBe(
			"You already have access to the women's draw. You may purchase the men's draw as well."
		)

		const subscriptionButton = screen.getByRole('button', { name: 'Get Started' })
		expect(subscriptionButton).not.toBeDisabled()
	})

	test('Disables all individual draws when user has Both Draws access', () => {
		const data = { ...mockBasePricingPageData, userAccess: UserAccess.BOTH }
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const mensButton = screen.getAllByRole('button', { name: 'Select' })[0]
		expect(mensButton).toBeDisabled()
		expect(getPlanMessage("Men's Draw")).toBe('You already have access to both draws.')

		const womensButton = screen.getAllByRole('button', { name: 'Select' })[1]
		expect(womensButton).toBeDisabled()
		expect(getPlanMessage("Women's Draw")).toBe('You already have access to both draws.')

		const bothButton = screen.getAllByRole('button', { name: 'Select' })[2]
		expect(bothButton).toBeDisabled()
		expect(getPlanMessage('Both Draws')).toBe('You already have access to both draws.')

		const subscriptionButton = screen.getByRole('button', { name: 'Get Started' })
		expect(subscriptionButton).not.toBeDisabled()
	})

	test('Disables all plans when user has Subscription access', () => {
		const data = { ...mockBasePricingPageData, userAccess: UserAccess.SUBSCRIPTION }
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const planButtons = screen.getAllByRole('button', { name: /Select|Get Started/ })
		for (const button of planButtons) {
			expect(button).toBeDisabled()
		}

		expect(getPlanMessage("Men's Draw")).toBe('You already have access through your subscription.')
		expect(getPlanMessage("Women's Draw")).toBe(
			'You already have access through your subscription.'
		)
		expect(getPlanMessage('Both Draws')).toBe('You already have access through your subscription.')
		expect(getPlanMessage('Full Access Subscription')).toBe(
			'You already have an active subscription.'
		)
	})

	test('Disables all plans when user is grandfathered', () => {
		const data = { ...mockBasePricingPageData, userAccess: UserAccess.GRANDFATHERED }
		render(PageSetup, {
			props: {
				component: Page,
				data
			}
		})

		const planButtons = screen.getAllByRole('button', { name: /Select|Get Started/ })
		for (const button of planButtons) {
			expect(button).toBeDisabled()
		}

		const message = 'No charge for you. Thanks for being an early supporter!'
		expect(getPlanMessage("Men's Draw")).toBe(message)
		expect(getPlanMessage("Women's Draw")).toBe(message)
		expect(getPlanMessage('Both Draws')).toBe(message)
		expect(getPlanMessage('Full Access Subscription')).toBe(message)
	})
})
