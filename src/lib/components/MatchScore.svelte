<script lang="ts">
	import type { Draw, Slot } from '$lib/types'
	import { compareAsc } from 'date-fns'

	interface Props {
		slot: Slot
		prevSlot1?: Slot
		prevSlot2?: Slot
		draw: Draw
	}

	let { slot, prevSlot1, prevSlot2, draw }: Props = $props()

	let firstToSets = $derived(draw.event === "Men's Singles" ? 3 : 2)
	const showScores = $derived(
		slot.name && slot.round > 4 && compareAsc(draw.start_date, '2024-06-30') > 0
	)

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

	let sets = $derived.by(() => {
		if (!prevSlot1 || !prevSlot2) {
			return []
		}

		let winner = slot.name === prevSlot1.name ? prevSlot1 : prevSlot2
		let loser = slot.name === prevSlot1.name ? prevSlot2 : prevSlot1

		let result: Set[] = []
		for (let i = 1; i <= 5; i++) {
			const games = `set${i}_games` as keyof Slot
			const tiebreak = `set${i}_tiebreak` as keyof Slot
			if (winner[games] === null || loser[games] === null) {
				break
			}

			result.push({
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

		if (result.length > 0) {
			const lastSet = result[result.length - 1]
			if (lastSet.winner.games === 0 && lastSet.loser.games === 0) {
				result.pop()
			}
		}

		return result
	})

	const isCompleteSet = (set: Set) => {
		if (
			(set.winner.games === 7 && set.loser.games === 6) ||
			(set.winner.games === 6 && set.loser.games === 7)
		) {
			return true
		}
		if (
			Math.max(set.winner.games, set.loser.games) >= 6 &&
			Math.abs(set.winner.games - set.loser.games) >= 2
		) {
			return true
		}

		return false
	}

	const isRetirement = (sets: Set[]) => {
		if (sets.length === 0) {
			return false
		}

		// Winner didn't win enough sets
		const winnerSetsWon = sets.filter(
			(set) => isCompleteSet(set) && set.winner.games > set.loser.games
		).length
		if (winnerSetsWon < firstToSets) {
			return true
		}
	}
</script>

<div class="flex w-full justify-center text-xs text-gray-500" data-testid="MatchScore">
	{#if showScores}
		{#if sets.length > 0}
			{#each sets as set, i}
				{@const tiebreakScore = Math.min(
					...[set.winner.tiebreak, set.loser.tiebreak].filter((score) => score > 0)
				)}
				<p>
					{set.winner.games}
				</p>
				{#if set.winner.games === 6 && set.loser.games === 7}
					<sup class="relative top-[3px]">{tiebreakScore}</sup>
				{/if}
				<p>{`-${set.loser.games}`}</p>
				{#if set.winner.games === 7 && set.loser.games === 6}
					<sup class="relative top-[3px]">{tiebreakScore}</sup>
				{/if}
				{#if i !== sets.length - 1}
					<p class="pr-0.5">{','}</p>
				{/if}
			{/each}
			{#if isRetirement(sets)}
				<p class="pl-1">(Ret.)</p>
			{/if}
		{:else}
			<p>Walkover</p>
		{/if}
	{/if}
</div>
