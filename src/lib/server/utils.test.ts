import type { Draw, Slot } from '$lib/types'
import { generateDummySlots } from '$lib/utils'
import { describe, expect, test } from 'vitest'
import { getActiveRound } from './utils'
import { ROUND_COMPLETE } from '../data'

describe('Active Round Labels', () => {
	const dummyDraw = {
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
	} as Draw
	const dummySlots = generateDummySlots('dummyDrawId', 1, 8)

	const testActiveRound = (activeRound: number, expectedTextContent: string) => {
		const newSlots = dummySlots.map((slot) => {
			return slot.round <= activeRound ? { ...slot, name: 'Some Player' } : slot
		}) as Slot[]

		const label = getActiveRound(dummyDraw, newSlots)
		expect(label).toBe(expectedTextContent)
	}

	const testRoundCompletedTag = (round: number, expectedTextContent: string) => {
		const newSlots = dummySlots.map((slot) => {
			return slot.round === round && slot.position === 1 ? { ...slot, name: ROUND_COMPLETE } : slot
		}) as Slot[]

		const label = getActiveRound(dummyDraw, newSlots)
		expect(label).toBe(expectedTextContent)
	}

	test('Qualifying Rounds', () => {
		testActiveRound(0, 'Qualifying Rounds')
		testRoundCompletedTag(0, 'Qualifying Rounds')
	})
	test('1st Round', () => {
		testActiveRound(1, '1st Round (R128)')
		testRoundCompletedTag(1, '1st Round (R128)')
	})
	test('2nd Round', () => {
		testActiveRound(2, '2nd Round (R64)')
		testRoundCompletedTag(2, '2nd Round (R64)')
	})
	test('3rd Round', () => {
		testActiveRound(3, '3rd Round (R32)')
		testRoundCompletedTag(3, '3rd Round (R32)')
	})
	test('Round of 16', () => {
		testActiveRound(4, 'Round of 16')
		testRoundCompletedTag(4, 'Round of 16')
	})
	test('Quarterfinals', () => {
		testActiveRound(5, 'Quarterfinals')
		testRoundCompletedTag(5, 'Quarterfinals')
	})
	test('Semifinals', () => {
		testActiveRound(6, 'Semifinals')
		testRoundCompletedTag(6, 'Semifinals')
	})
	test('Final', () => {
		testActiveRound(7, 'Final')
		testRoundCompletedTag(7, 'Final')
	})
	test('Tournament Completed', () => {
		testActiveRound(8, 'Tournament Completed')
		testRoundCompletedTag(8, 'Tournament Completed')
	})
})
