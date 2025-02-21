import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import MatchScore from './MatchScore.svelte'
import type { Draw, Slot } from '$lib/types'

const baseSlot: Slot = {
	collectionId: 'abc123',
	collectionName: 'slots_with_scores',
	created: '2024-01-15 12:00:00',
	draw_id: 'draw123',
	id: 'slot1',
	name: 'Novak Djokovic',
	position: 1,
	round: 4,
	seed: '1',
	updated: '2024-01-15 14:00:00',
	set1_id: 'set1',
	set1_games: 6,
	set1_tiebreak: 0,
	set2_id: 'set2',
	set2_games: 7,
	set2_tiebreak: 0,
	set3_id: 'set3',
	set3_games: 6,
	set3_tiebreak: 0,
	set4_id: null,
	set4_games: null,
	set4_tiebreak: null,
	set5_id: null,
	set5_games: null,
	set5_tiebreak: null
}

const draw: Draw = {
	collectionId: 'draws123',
	collectionName: 'draw',
	created: '2025-01-01 00:00:00',
	end_date: '2025-01-28',
	event: "Men's Singles",
	id: 'draw123',
	name: 'Australian Open',
	prediction_close: '2024-01-14 00:00:00',
	size: 128,
	start_date: '2025-01-14',
	updated: '2024-01-01 00:00:00',
	url: 'https://example.com/draw',
	year: 2025
}

describe('MatchScore component', () => {
	test('Renders with tiebreak', () => {
		const prevSlot1: Slot = { ...baseSlot }

		const prevSlot2: Slot = {
			...baseSlot,
			id: 'slot2',
			name: 'Carlos Alcaraz',
			position: 2,
			seed: '2',
			set1_games: 4,
			set2_games: 6,
			set2_tiebreak: 4,
			set3_games: 4
		}

		const slot: Slot = {
			...baseSlot,
			id: 'slot3',
			round: 5,
			position: 1
		}

		render(MatchScore, {
			slot,
			prevSlot1,
			prevSlot2,
			draw
		})

		const score = screen.getByTestId('MatchScore').textContent?.replaceAll(' ', '')
		expect(score).toBe('6-4,7-64,6-4')
	})

	test('Retirement', () => {
		const prevSlot1: Slot = {
			...baseSlot,
			set3_id: null,
			set3_games: null,
			set3_tiebreak: null
		}

		const prevSlot2: Slot = {
			...baseSlot,
			id: 'slot2',
			name: 'Carlos Alcaraz',
			position: 2,
			seed: '2',
			set1_games: 4,
			set2_games: 6,
			set2_tiebreak: 4,
			set3_id: null,
			set3_games: null,
			set3_tiebreak: null
		}

		const slot: Slot = {
			...baseSlot,
			id: 'slot3',
			round: 5,
			position: 1
		}

		render(MatchScore, {
			slot,
			prevSlot1,
			prevSlot2,
			draw
		})

		const score = screen.getByTestId('MatchScore').textContent?.replaceAll(' ', '')
		expect(score).toBe('6-4,7-64(Ret.)')
	})

	test('Walkover', () => {
		const prevSlot1: Slot = {
			...baseSlot,
			set1_id: null,
			set1_games: null,
			set1_tiebreak: null,
			set2_id: null,
			set2_games: null,
			set2_tiebreak: null,
			set3_id: null,
			set3_games: null,
			set3_tiebreak: null
		}

		const prevSlot2: Slot = {
			...baseSlot,
			id: 'slot2',
			name: 'Carlos Alcaraz',
			position: 2,
			seed: '2',
			set1_id: null,
			set1_games: null,
			set1_tiebreak: null,
			set2_id: null,
			set2_games: null,
			set2_tiebreak: null,
			set3_id: null,
			set3_games: null,
			set3_tiebreak: null
		}

		const slot: Slot = {
			...baseSlot,
			id: 'slot3',
			round: 5,
			position: 1
		}

		render(MatchScore, {
			slot,
			prevSlot1,
			prevSlot2,
			draw
		})

		const score = screen.getByTestId('MatchScore').textContent?.replaceAll(' ', '')
		expect(score).toBe('Walkover')
	})
})
