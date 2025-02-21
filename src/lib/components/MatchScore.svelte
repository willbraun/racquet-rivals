<script lang="ts">
	import type { Slot } from '$lib/types'

	interface Props {
		slot: Slot
		allSlots: Slot[]
		showTieBreak: boolean
	}

	let { slot, allSlots, showTieBreak }: Props = $props()

	const prevSlot1 = allSlots.find(
		(s) => s.round === slot.round - 1 && s.position === slot.position * 2 - 1
	)
	const prevSlot2 = allSlots.find(
		(s) => s.round === slot.round - 1 && s.position === slot.position * 2
	)

	let winner: Slot | null = $state(null)
	let loser: Slot | null = $state(null)

	if (prevSlot1 && prevSlot2) {
		if (slot.name === prevSlot1.name) {
			winner = prevSlot1
			loser = prevSlot2
		} else {
			winner = prevSlot2
			loser = prevSlot1
		}
	}

	interface Set {
		winner: {
			games: number
			tiebreak: number
		}
		loser: {
			games: number
			tiebreak: number
		}
	}

	let sets: Set[] = []
	if (winner && loser) {
		for (let i = 1; i <= 5; i++) {
			const games = `set${i}_games` as keyof Slot
			const tiebreak = `set${i}_tiebreak` as keyof Slot
			if (winner[games] === null || loser[games] === null) {
				break
			}

			sets.push({
				winner: {
					games: Number(winner[games]),
					tiebreak: Number(winner[tiebreak])
				},
				loser: {
					games: Number(loser[games]),
					tiebreak: Number(loser[tiebreak])
				}
			})
		}
	}
</script>

<div class="flex w-full text-xs text-gray-500">
	{#if winner && loser}
		{#each sets as set, i}
			<p>
				{set.winner.games.toString().trim()}
				{#if set.winner.games === 6 && set.loser.games === 7}
					<sup>({set.winner.tiebreak.toString().trim()})</sup>
				{/if}
			</p>
			{'-'}
			<p>
				{set.loser.games.toString().trim()}
				{#if set.winner.games === 7 && set.loser.games === 6}
					<sup>({set.loser.tiebreak.toString().trim()})</sup>
				{/if}
			</p>
			{#if i !== sets.length - 1}
				{', '}
			{/if}
		{/each}
	{:else}
		<p>No previous matches</p>
	{/if}
</div>
