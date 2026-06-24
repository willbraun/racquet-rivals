import type { Draw, Slot } from '$lib/types'
import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'
import EarlyRoundsContent from './EarlyRoundsContent.svelte'

const draw: Draw = {
	collectionId: 'drawCollection',
	collectionName: 'draw',
	created: '2026-01-01 00:00:00',
	end_date: '2026-01-31',
	event: "Men's Singles",
	id: 'draw-1',
	name: 'Australian Open',
	prediction_close: '2026-01-10 00:00:00',
	size: 128,
	start_date: '2026-01-14',
	updated: '2026-01-01 00:00:00',
	url: 'https://example.com/draw/1',
	year: 2026
}

const makeSlot = (overrides: Partial<Slot>): Slot => {
	return {
		collectionId: 'slotCollection',
		collectionName: 'slots_with_scores',
		created: '2026-01-01 00:00:00',
		draw_id: draw.id,
		id: `slot-${overrides.round ?? 1}-${overrides.position ?? 1}`,
		name: '',
		position: 1,
		round: 1,
		seed: '',
		updated: '2026-01-01 00:00:00',
		set1_id: 'set1',
		set1_games: null,
		set1_tiebreak: null,
		set2_id: 'set2',
		set2_games: null,
		set2_tiebreak: null,
		set3_id: 'set3',
		set3_games: null,
		set3_tiebreak: null,
		set4_id: 'set4',
		set4_games: null,
		set4_tiebreak: null,
		set5_id: 'set5',
		set5_games: null,
		set5_tiebreak: null,
		...overrides
	}
}

describe('EarlyRoundsContent component', () => {
	test('renders empty state when selected slot has no player name', () => {
		const slot = makeSlot({ round: 4, position: 1, name: '', seed: '' })

		render(EarlyRoundsContent, {
			slot,
			earlySlots: [slot],
			draw,
			onclose: vi.fn()
		})

		expect(screen.getByText('No early round data available.')).toBeInTheDocument()
	})

	test('renders opponent rows across early rounds', () => {
		const selectedSlot = makeSlot({ round: 4, position: 1, name: 'Novak Djokovic', seed: '1' })
		const earlySlots: Slot[] = [
			selectedSlot,
			makeSlot({ round: 3, position: 1, name: 'Novak Djokovic', seed: '1' }),
			makeSlot({ round: 3, position: 2, name: 'Stefanos Tsitsipas', seed: '5' }),
			makeSlot({ round: 2, position: 1, name: 'Novak Djokovic', seed: '1' }),
			makeSlot({ round: 2, position: 2, name: 'Taylor Fritz', seed: '9' }),
			makeSlot({ round: 2, position: 3, name: 'Stefanos Tsitsipas', seed: '5' }),
			makeSlot({ round: 2, position: 4, name: 'Hubert Hurkacz', seed: '8' }),
			makeSlot({ round: 1, position: 1, name: 'Novak Djokovic', seed: '1' }),
			makeSlot({ round: 1, position: 2, name: 'Alex de Minaur', seed: '12' }),
			makeSlot({ round: 1, position: 3, name: 'Taylor Fritz', seed: '9' }),
			makeSlot({ round: 1, position: 4, name: 'Frances Tiafoe', seed: '16' }),
			makeSlot({ round: 1, position: 5, name: 'Stefanos Tsitsipas', seed: '5' }),
			makeSlot({ round: 1, position: 6, name: 'Andrey Rublev', seed: '7' }),
			makeSlot({ round: 1, position: 7, name: 'Hubert Hurkacz', seed: '8' }),
			makeSlot({ round: 1, position: 8, name: 'Tommy Paul', seed: '10' })
		]

		render(EarlyRoundsContent, {
			slot: selectedSlot,
			earlySlots,
			draw,
			onclose: vi.fn()
		})

		expect(screen.getByText('1 Novak Djokovic')).toBeInTheDocument()
		expect(screen.getAllByText('R3').length).toBeGreaterThan(0)
		expect(screen.getByText('5 Stefanos Tsitsipas')).toBeInTheDocument()
		expect(screen.getAllByText('R2').length).toBeGreaterThan(0)
		expect(screen.getByText('9 Taylor Fritz')).toBeInTheDocument()
		expect(screen.getAllByText('R1').length).toBeGreaterThan(0)
		expect(screen.getByText('12 Alex de Minaur')).toBeInTheDocument()
	})

	test('calls onclose when close button is clicked', async () => {
		const slot = makeSlot({ round: 4, position: 1, name: 'Novak Djokovic', seed: '1' })
		const onclose = vi.fn()

		render(EarlyRoundsContent, {
			slot,
			earlySlots: [slot],
			draw,
			onclose
		})

		await fireEvent.click(screen.getByRole('button', { name: 'close' }))
		expect(onclose).toHaveBeenCalledTimes(1)
	})
})
