import { type ScraperHealthCheck } from '$lib/types'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import HealthStatusCard from './HealthStatusCard.svelte'

const baseHealthData: ScraperHealthCheck = {
	collectionId: 'abc123',
	collectionName: 'scraper_health_check',
	id: 'health1',
	draw_type: 'atp',
	draw_url: 'https://example.com/atp-draw',
	error: '',
	created: '2026-01-12 10:00:00.000Z',
	updated: '2026-01-12 12:30:45.000Z'
}

describe('HealthStatusCard component', () => {
	describe('Success status', () => {
		test('Renders success status when error is empty', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: ''
			}

			render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			expect(screen.getByText('ATP Scraper')).toBeInTheDocument()
			expect(screen.getByText('Status:')).toBeInTheDocument()
			expect(screen.getByText(/Success/)).toBeInTheDocument()
			expect(screen.getByText(/✅/)).toBeInTheDocument()
		})

		test('Does not show error details section when error is empty', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: ''
			}

			render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			expect(screen.queryByText('Error Details:')).not.toBeInTheDocument()
		})

		test('Applies success color classes', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: ''
			}

			const { container } = render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			const statusBadge = container.querySelector('.rounded-full.px-4.py-1')
			expect(statusBadge).toHaveClass('text-green-700')
			expect(statusBadge).toHaveClass('bg-green-100')
		})
	})

	describe('Waiting status', () => {
		test('Renders waiting status when error contains "not found"', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: 'Draw not found for current event'
			}

			const { container } = render(HealthStatusCard, {
				title: 'WTA Scraper',
				healthData
			})

			const statusBadge = container.querySelector('.rounded-full.px-4.py-1')
			expect(statusBadge?.textContent).toContain('Waiting')
			expect(screen.getByText(/⏳/)).toBeInTheDocument()
		})

		test('Renders waiting status when error contains "not started"', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: 'Tournament not started yet'
			}

			render(HealthStatusCard, {
				title: 'WTA Scraper',
				healthData
			})

			expect(screen.getByText(/Waiting/)).toBeInTheDocument()
			expect(screen.getByText(/⏳/)).toBeInTheDocument()
		})

		test('Shows error details section for waiting status', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: 'Draw not found'
			}

			render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			expect(screen.getByText('Error Details:')).toBeInTheDocument()
			expect(screen.getByText('Draw not found')).toBeInTheDocument()
		})

		test('Applies waiting color classes', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: 'Tournament not started'
			}

			const { container } = render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			const statusBadge = container.querySelector('.rounded-full.px-4.py-1')
			expect(statusBadge).toHaveClass('text-yellow-800')
			expect(statusBadge).toHaveClass('bg-yellow-200')

			const errorText = screen.getByText('Tournament not started')
			expect(errorText).toHaveClass('bg-yellow-100')
			expect(errorText).toHaveClass('text-yellow-800')
		})
	})

	describe('Error status', () => {
		test('Renders error status when error is present and not waiting', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: 'Connection timeout'
			}

			render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			expect(
				screen.getByText(
					(_, element) =>
						element?.textContent?.trim() === '❌ Error' ||
						(element?.textContent?.includes('Error') &&
							element?.className.includes('rounded-full')) ||
						false
				)
			).toBeInTheDocument()
			expect(screen.getByText(/❌/)).toBeInTheDocument()
		})

		test('Shows error details section for error status', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: 'Failed to parse HTML: Unexpected token'
			}

			render(HealthStatusCard, {
				title: 'WTA Scraper',
				healthData
			})

			expect(screen.getByText('Error Details:')).toBeInTheDocument()
			expect(screen.getByText('Failed to parse HTML: Unexpected token')).toBeInTheDocument()
		})

		test('Applies error color classes', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: 'Network error'
			}

			const { container } = render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			const statusBadge = container.querySelector('.rounded-full.px-4.py-1')
			expect(statusBadge).toHaveClass('text-red-600')
			expect(statusBadge).toHaveClass('bg-red-100')

			const errorDetailsLabel = screen.getByText('Error Details:')
			expect(errorDetailsLabel).toHaveClass('text-red-600')

			const errorText = screen.getByText('Network error')
			expect(errorText).toHaveClass('bg-red-50')
			expect(errorText).toHaveClass('text-red-900')
		})
	})

	describe('Draw URL', () => {
		test('Renders draw URL as a link', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				draw_url: 'https://www.atptour.com/en/scores/current/australian-open/580/draws'
			}

			render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			expect(screen.getByText('Draw URL:')).toBeInTheDocument()
			const link = screen.getByRole('link', {
				name: 'https://www.atptour.com/en/scores/current/australian-open/580/draws'
			})
			expect(link).toBeInTheDocument()
			expect(link).toHaveAttribute(
				'href',
				'https://www.atptour.com/en/scores/current/australian-open/580/draws'
			)
			expect(link).toHaveAttribute('target', '_blank')
			expect(link).toHaveAttribute('rel', 'noopener noreferrer')
		})
	})

	describe('No health data', () => {
		test('Renders no data message when healthData is null', () => {
			render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData: null
			})

			expect(screen.getByText('ATP Scraper')).toBeInTheDocument()
			expect(screen.getByText('No health check data available')).toBeInTheDocument()
			expect(screen.queryByText('Status:')).not.toBeInTheDocument()
			expect(screen.queryByText('Last Check:')).not.toBeInTheDocument()
			expect(screen.queryByText('Draw URL:')).not.toBeInTheDocument()
		})
	})

	describe('Edge cases', () => {
		test('Handles multiline error messages', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error:
					'Multiple errors occurred:\n1. Network timeout\n2. Invalid response\n3. Parsing failed'
			}

			render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			const errorMessage = screen.getByText((content, element) => {
				return element?.tagName === 'P' && content.includes('Multiple errors occurred:')
			})
			expect(errorMessage).toBeInTheDocument()
		})

		test('Handles error containing both "not found" and other text', () => {
			const healthData: ScraperHealthCheck = {
				...baseHealthData,
				error: 'Error: Draw not found in the database after multiple retries'
			}

			render(HealthStatusCard, {
				title: 'ATP Scraper',
				healthData
			})

			// Should be waiting status because it contains "not found"
			expect(screen.getByText(/Waiting/)).toBeInTheDocument()
			expect(screen.getByText(/⏳/)).toBeInTheDocument()
		})
	})
})
