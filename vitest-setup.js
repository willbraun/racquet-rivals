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
