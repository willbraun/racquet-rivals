import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

window.matchMedia =
	window.matchMedia ||
	function () {
		return {
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		}
	}

// Mock Chart.js globally to prevent canvas rendering issues in tests
vi.mock('chart.js/auto', () => {
	const mockChart = vi.fn().mockImplementation(() => ({
		data: {
			labels: [],
			datasets: [{ data: [] }]
		},
		options: {
			elements: {
				arc: {
					borderWidth: vi.fn(),
					borderColor: vi.fn()
				}
			}
		},
		update: vi.fn(),
		destroy: vi.fn()
	}))

	return {
		Chart: mockChart
	}
})

vi.mock('$app/stores', async () => {
	const { readable, writable } = await import('svelte/store')
	/**
	 * @type {import('$app/stores').getStores}
	 */
	const getStores = () => ({
		navigating: readable(null),
		page: readable({ url: new URL('http://localhost'), params: {} }),
		session: writable(null),
		updated: readable(false)
	})
	/** @type {typeof import('$app/stores').page} */
	const page = {
		subscribe(fn) {
			return getStores().page.subscribe(fn)
		}
	}
	/** @type {typeof import('$app/stores').navigating} */
	const navigating = {
		subscribe(fn) {
			return getStores().navigating.subscribe(fn)
		}
	}
	/** @type {typeof import('$app/stores').session} */
	const session = {
		subscribe(fn) {
			return getStores().session.subscribe(fn)
		}
	}
	/** @type {typeof import('$app/stores').updated} */
	const updated = {
		subscribe(fn) {
			return getStores().updated.subscribe(fn)
		}
	}
	return {
		getStores,
		navigating,
		page,
		session,
		updated
	}
})
