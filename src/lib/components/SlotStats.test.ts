import { IsCorrect, type PredictionDistribution, type Slot } from '$lib/types'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { get } from 'svelte/store'
import { beforeEach, describe, expect, test } from 'vitest'
import { predictionDistributionStore, slotStatsOpen } from '../store'
import SlotStats from './SlotStats.svelte'

const baseSlot: Slot = {
	collectionId: 'abc123',
	collectionName: 'slots_with_scores',
	created: '2024-01-15 12:00:00',
	draw_id: 'draw123',
	id: 'slot1',
	name: 'Swiatek',
	position: 1,
	round: 6,
	seed: '1',
	updated: '2024-01-15 14:00:00',
	set1_id: 'set1',
	set1_games: 6,
	set1_tiebreak: 0,
	set2_id: 'set2',
	set2_games: 6,
	set2_tiebreak: 0,
	set3_id: null,
	set3_games: null,
	set3_tiebreak: null,
	set4_id: null,
	set4_games: null,
	set4_tiebreak: null,
	set5_id: null,
	set5_games: null,
	set5_tiebreak: null
}

const basePredictionDistribution: PredictionDistribution = {
	collectionId: 'dist123',
	collectionName: 'prediction_stats',
	id: 'dist1',
	draw_id: 'draw123',
	draw_slot_id: 'slot1',
	round: 6,
	position: 1,
	name: 'Swiatek',
	percentage: 62.5,
	name_count: 5,
	is_correct: IsCorrect.CORRECT
}

describe('SlotStats component', () => {
	beforeEach(() => {
		// Reset stores before each test
		slotStatsOpen.set(null)
		predictionDistributionStore.set([])
	})

	describe('Round display tests', () => {
		test('Displays correct round name and position for Round of 16', () => {
			const slot: Slot = { ...baseSlot, round: 5, position: 3 }
			slotStatsOpen.set(slot)

			render(SlotStats)

			expect(screen.getByText(/Round of 16 #3/)).toBeInTheDocument()
		})

		test('Displays correct round name and position for Quarterfinal', () => {
			const slot: Slot = { ...baseSlot, round: 6, position: 2 }
			slotStatsOpen.set(slot)

			render(SlotStats)

			expect(screen.getByText(/Quarterfinal #2/)).toBeInTheDocument()
		})

		test('Displays correct round name and position for Semifinal', () => {
			const slot: Slot = { ...baseSlot, round: 7, position: 1 }
			slotStatsOpen.set(slot)

			render(SlotStats)

			expect(screen.getByText(/Semifinal #1/)).toBeInTheDocument()
		})

		test('Displays Final without position number', () => {
			const slot: Slot = { ...baseSlot, round: 8, position: 1 }
			slotStatsOpen.set(slot)

			render(SlotStats)

			expect(screen.getByText('Final')).toBeInTheDocument()
			expect(screen.queryByText(/#1/)).not.toBeInTheDocument()
		})

		test('Handles unknown round gracefully', () => {
			const slot: Slot = { ...baseSlot, round: 99, position: 1 }
			slotStatsOpen.set(slot)

			render(SlotStats)

			expect(screen.getByText(/Unknown round/)).toBeInTheDocument()
		})
	})

	describe('Data display tests', () => {
		test('Renders canvas element for chart', () => {
			const slot: Slot = { ...baseSlot }
			slotStatsOpen.set(slot)

			const distribution: PredictionDistribution[] = [
				{ ...basePredictionDistribution, name: 'Swiatek', name_count: 5 },
				{ ...basePredictionDistribution, id: 'dist2', name: 'Pegula', name_count: 3 }
			]
			predictionDistributionStore.set(distribution)

			const { container } = render(SlotStats)

			const canvas = container.querySelector('canvas')
			expect(canvas).toBeInTheDocument()
		})

		test('Handles empty prediction distribution', () => {
			const slot: Slot = { ...baseSlot, name: '' }
			slotStatsOpen.set(slot)
			predictionDistributionStore.set([])

			const { container } = render(SlotStats)

			const canvas = container.querySelector('canvas')
			expect(canvas).toBeInTheDocument()
		})
	})

	describe('Interaction tests', () => {
		test('Closes modal when X button is clicked', async () => {
			const user = userEvent.setup()
			const slot: Slot = { ...baseSlot }
			slotStatsOpen.set(slot)

			render(SlotStats)

			const closeButton = screen.getByAltText('close')
			await user.click(closeButton)

			expect(get(slotStatsOpen)).toBeNull()
		})

		test('X button is visible and clickable', async () => {
			const slot: Slot = { ...baseSlot }
			slotStatsOpen.set(slot)

			render(SlotStats)

			const closeButton = screen.getByAltText('close')
			expect(closeButton).toBeVisible()
			expect(closeButton).toBeEnabled()
		})
	})

	describe('Edge cases', () => {
		test('Handles slot with undefined values', () => {
			const slot: Slot = {
				...baseSlot,
				name: '',
				seed: '',
				round: 0,
				position: 0
			}
			slotStatsOpen.set(slot)

			render(SlotStats)

			expect(screen.getByText(/Unknown round/)).toBeInTheDocument()
		})

		test('Handles slot with only one prediction', () => {
			const slot: Slot = { ...baseSlot }
			slotStatsOpen.set(slot)

			const distribution: PredictionDistribution[] = [
				{ ...basePredictionDistribution, name: 'Swiatek', name_count: 1 }
			]
			predictionDistributionStore.set(distribution)

			const { container } = render(SlotStats)

			const canvas = container.querySelector('canvas')
			expect(canvas).toBeInTheDocument()
		})

		test('Handles maximum number of different predictions (16 colors)', () => {
			const slot: Slot = { ...baseSlot }
			slotStatsOpen.set(slot)

			const distribution: PredictionDistribution[] = Array.from({ length: 16 }, (_, i) => ({
				...basePredictionDistribution,
				id: `dist${i}`,
				name: `Player${i}`,
				name_count: i + 1
			}))
			predictionDistributionStore.set(distribution)

			const { container } = render(SlotStats)

			const canvas = container.querySelector('canvas')
			expect(canvas).toBeInTheDocument()
		})

		test('Handles more than 16 different predictions', () => {
			const slot: Slot = { ...baseSlot }
			slotStatsOpen.set(slot)

			const distribution: PredictionDistribution[] = Array.from({ length: 20 }, (_, i) => ({
				...basePredictionDistribution,
				id: `dist${i}`,
				name: `Player${i}`,
				name_count: i + 1
			}))
			predictionDistributionStore.set(distribution)

			const { container } = render(SlotStats)

			const canvas = container.querySelector('canvas')
			expect(canvas).toBeInTheDocument()
		})
	})

	describe('Reactivity tests', () => {
		test('Updates when slotStatsOpen changes to different slot', async () => {
			const slot1: Slot = { ...baseSlot, id: 'slot1', round: 6, position: 1 }
			slotStatsOpen.set(slot1)

			const { rerender } = render(SlotStats)

			expect(screen.getByText(/Quarterfinal #1/)).toBeInTheDocument()

			// Change to different slot
			const slot2: Slot = { ...baseSlot, id: 'slot2', round: 7, position: 2 }
			slotStatsOpen.set(slot2)
			await rerender({})

			expect(screen.getByText(/Semifinal #2/)).toBeInTheDocument()
		})

		test('Updates when predictionDistributionStore changes', async () => {
			const slot: Slot = { ...baseSlot }
			slotStatsOpen.set(slot)

			const distribution1: PredictionDistribution[] = [
				{ ...basePredictionDistribution, name: 'Swiatek', name_count: 5 }
			]
			predictionDistributionStore.set(distribution1)

			const { rerender, container } = render(SlotStats)

			let canvas = container.querySelector('canvas')
			expect(canvas).toBeInTheDocument()

			// Add more predictions
			const distribution2: PredictionDistribution[] = [
				{ ...basePredictionDistribution, name: 'Swiatek', name_count: 6 },
				{ ...basePredictionDistribution, id: 'dist2', name: 'Pegula', name_count: 2 }
			]
			predictionDistributionStore.set(distribution2)
			await rerender({})

			canvas = container.querySelector('canvas')
			expect(canvas).toBeInTheDocument()
		})
	})
})
