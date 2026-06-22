<script lang="ts">
	import MatchScore from '$lib/components/MatchScore.svelte'
	import x from '$lib/images/icons/x.svg'
	import type { Draw, Slot } from '$lib/types'
	import { getFullDrawRounds } from '$lib/utils'
	import { SvelteMap } from 'svelte/reactivity'
	import { isMobile } from '../../../lib/store'

	interface Props {
		slot: Slot
		earlySlots: Slot[]
		draw: Draw
		onclose: () => void
	}

	let { slot, earlySlots, draw, onclose }: Props = $props()

	const startRound = $derived(getFullDrawRounds(draw) - 4)

	interface MatchDisplay {
		label: string
		advancingSlot: Slot
		prevSlot1: Slot | undefined
		prevSlot2: Slot | undefined
		opponentSlot: Slot | undefined
	}

	let matches = $derived.by((): MatchDisplay[] => {
		const playerName = slot.name
		if (!playerName) return []

		// Build a map from round number → the slot where this player is the winner
		// (i.e., the slot they advanced TO after winning the round-(r-1) match)
		const playerSlots = new SvelteMap<number, Slot>()
		playerSlots.set(startRound, slot)

		// Trace backwards from startRound down to round 2 to find the player's slot at each level
		for (let r = startRound - 1; r >= 2; r--) {
			const childSlot = playerSlots.get(r + 1)!
			const prevSlot = earlySlots.find(
				(s) =>
					s.round === r &&
					(s.position === childSlot.position * 2 - 1 || s.position === childSlot.position * 2) &&
					s.name === playerName
			)
			if (prevSlot) playerSlots.set(r, prevSlot)
		}

		const result: MatchDisplay[] = []

		// Build match display entries from earliest round to latest
		// matchRound = the round of the match played (1-indexed tournament round)
		// advancingSlot = the slot the player advanced TO after winning that match (round matchRound+1)
		// prevSlot1/2 = the two players who competed in that match (at round matchRound)
		for (let matchRound = 1; matchRound < startRound; matchRound++) {
			const advancing = playerSlots.get(matchRound + 1)
			if (!advancing) continue

			const p1 = earlySlots.find(
				(s) => s.round === matchRound && s.position === advancing.position * 2 - 1
			)
			const p2 = earlySlots.find(
				(s) => s.round === matchRound && s.position === advancing.position * 2
			)
			const opponentSlot = p1?.name === playerName ? p2 : p1

			result.push({
				label: `R${matchRound}`,
				advancingSlot: advancing,
				prevSlot1: p1,
				prevSlot2: p2,
				opponentSlot
			})
		}

		return result
	})
</script>

<div class="flex h-full w-full flex-col items-center rounded-xl bg-white">
	<div class="bg-primary-100 relative w-full p-3 text-center" class:rounded-t-xl={!$isMobile}>
		<p class="text-2xl font-bold">{slot.seed} {slot.name}</p>
		<p class="text-sm">Early Round Results</p>
		<button onclick={onclose} class="absolute top-1/2 right-4 -translate-y-1/2">
			<img src={x} alt="close" width="20" />
		</button>
	</div>

	<div class="w-full divide-y divide-stone-200 overflow-y-auto">
		{#each matches as match (match.label)}
			<div class="flex items-center gap-4 px-6 py-4">
				<p class="w-8 shrink-0 font-semibold text-stone-500">{match.label}</p>
				<div class="flex-1">
					<p class="text-lg font-medium">
						{match.opponentSlot?.seed ?? ''}
						{match.opponentSlot?.name ?? 'Unknown'}
					</p>
					<MatchScore
						slot={match.advancingSlot}
						prevSlot1={match.prevSlot1}
						prevSlot2={match.prevSlot2}
						{draw}
						forceShowScores={true}
						textSize="text-sm"
					/>
				</div>
				<p class="font-semibold text-green-600">W</p>
			</div>
		{/each}
		{#if matches.length === 0}
			<p class="p-6 text-center text-stone-500 italic">No early round data available.</p>
		{/if}
	</div>
</div>
