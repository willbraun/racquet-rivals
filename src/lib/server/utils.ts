import type { Draw, Slot } from '$lib/types'
import { errorMessage, getAllRounds, getFullDrawRounds, getOurRounds } from '$lib/utils'
import { error } from '@sveltejs/kit'
import type { ClientResponseError } from 'pocketbase'

export const fetchJson = async (url: string, svelteFetch: SvelteFetch, token?: string) => {
	const options: RequestInit = token
		? {
				headers: {
					Authorization: token
				}
			}
		: {}

	try {
		const response = await svelteFetch(url, options)
		const data = await response.json()

		return data
	} catch (e) {
		const statusCode = (e as ClientResponseError).status
		return error(statusCode, errorMessage(statusCode))
	}
}

export const getActiveRound = (draw: Draw, slots: Slot[]) => {
	const fullDrawRounds = getFullDrawRounds(draw)
	const allRounds = getAllRounds(fullDrawRounds)
	const ourRounds = getOurRounds(allRounds)
	const filledRounds = allRounds.filter((round) => {
		return slots
			.filter((slot) => {
				return slot.round === round
			})
			.every((slot) => slot.name.trim() !== '')
	})

	if (filledRounds.at(-1) === fullDrawRounds) {
		return 'Tournament Completed'
	}

	const activeRoundIndex = Math.max(0, ...filledRounds) // round being played
	const labels = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final']
	const index = ourRounds.indexOf(activeRoundIndex)

	if (index !== -1) {
		return labels[index]
	} else {
		const sizeLabel = `(R${2 ** (fullDrawRounds - activeRoundIndex)})`
		const earlyLabels = [
			'Qualifying Rounds',
			`1st Round ${sizeLabel}`,
			`2nd Round ${sizeLabel}`,
			`3rd Round ${sizeLabel}`
		]
		return `${earlyLabels[activeRoundIndex]}`
	}
}
