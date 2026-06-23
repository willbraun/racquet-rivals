<script lang="ts">
	import MatchScore from '$lib/components/MatchScore.svelte'
	import x from '$lib/images/icons/x.svg'
	import type { Draw, Slot } from '$lib/types'
	import { getFullDrawRounds } from '$lib/utils'
	import { Accordion } from '@skeletonlabs/skeleton-svelte'
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
		id: string
		matchRound: number
		label: string
		advancingSlot: Slot
		prevSlot1: Slot | undefined
		prevSlot2: Slot | undefined
		playerSlot: Slot | undefined
		opponentSlot: Slot | undefined
		playerHistory: MatchDisplay | undefined
		opponentHistory: MatchDisplay | undefined
	}

	const getSlot = (round: number, position: number): Slot | undefined => {
		return earlySlots.find((s) => s.round === round && s.position === position)
	}

	const getMatchForWinner = (advancingSlot: Slot, winnerName: string): MatchDisplay | undefined => {
		const matchRound = advancingSlot.round - 1
		if (matchRound < 1) return undefined

		const prevSlot1 = getSlot(matchRound, advancingSlot.position * 2 - 1)
		const prevSlot2 = getSlot(matchRound, advancingSlot.position * 2)

		if (!prevSlot1 && !prevSlot2) {
			return undefined
		}

		const winnerPrevSlot =
			prevSlot1?.name === winnerName
				? prevSlot1
				: prevSlot2?.name === winnerName
					? prevSlot2
					: undefined

		const opponentSlot =
			prevSlot1?.name === winnerName
				? prevSlot2
				: prevSlot2?.name === winnerName
					? prevSlot1
					: undefined

		return {
			id: `match-${winnerName}-${advancingSlot.round}-${advancingSlot.position}`,
			matchRound,
			label: `R${matchRound}`,
			advancingSlot,
			prevSlot1,
			prevSlot2,
			playerSlot: winnerPrevSlot,
			opponentSlot,
			playerHistory: undefined,
			opponentHistory:
				winnerPrevSlot && winnerPrevSlot.name && matchRound > 1
					? getMatchForWinner(winnerPrevSlot, winnerPrevSlot.name)
					: undefined
		}
	}

	const getPlayerDisplayName = (targetSlot: Slot | undefined): string => {
		if (!targetSlot?.name) return 'Unknown'
		if (!targetSlot.seed) return targetSlot.name

		return `${targetSlot.seed} ${targetSlot.name}`
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

			const p1 = getSlot(matchRound, advancing.position * 2 - 1)
			const p2 = getSlot(matchRound, advancing.position * 2)
			const playerSlot = p1?.name === playerName ? p1 : p2?.name === playerName ? p2 : undefined
			const opponentSlot = p1?.name === playerName ? p2 : p1
			const playerHistory =
				playerSlot?.name && matchRound >= 2 ? getMatchForWinner(playerSlot, playerName) : undefined
			const opponentHistory =
				opponentSlot?.name && matchRound >= 2
					? getMatchForWinner(opponentSlot, opponentSlot.name)
					: undefined

			result.push({
				id: `selected-player-match-${matchRound}-${advancing.position}`,
				matchRound,
				label: `R${matchRound}`,
				advancingSlot: advancing,
				prevSlot1: p1,
				prevSlot2: p2,
				playerSlot,
				opponentSlot,
				playerHistory,
				opponentHistory
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
			{#if match.matchRound === 3 && match.opponentHistory}
				{@const r3R2 = match.opponentHistory}
				{@const r3R1 = r3R2.opponentHistory}
				{@const r3R2R1 = r3R2.opponentSlot?.name
					? getMatchForWinner(r3R2.opponentSlot, r3R2.opponentSlot.name)
					: undefined}
				<Accordion collapsible>
					<Accordion.Item value={`${match.id}-r3-history`}>
						<Accordion.ItemTrigger class="w-full px-6 py-4 hover:bg-stone-50 hover:text-inherit">
							<div class="flex w-full items-center gap-4 text-left">
								<p class="w-8 shrink-0 font-semibold text-stone-500">{match.label}</p>
								<div class="flex-1">
									<p class="text-lg font-medium">{getPlayerDisplayName(match.opponentSlot)}</p>
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
						</Accordion.ItemTrigger>
						<Accordion.ItemContent class="px-6 pb-4">
							<div class="border-primary-100 ml-12 border-l pl-4">
								<Accordion collapsible>
									<Accordion.Item value={`${r3R2.id}-details`}>
										<Accordion.ItemTrigger
											class="w-full py-3 text-left hover:bg-stone-50 hover:text-inherit"
										>
											<div class="flex w-full items-center gap-4">
												<p class="w-8 shrink-0 font-semibold text-stone-500">{r3R2.label}</p>
												<div class="flex-1">
													<p class="text-lg font-medium">
														{getPlayerDisplayName(r3R2.opponentSlot)}
													</p>
													<MatchScore
														slot={r3R2.advancingSlot}
														prevSlot1={r3R2.prevSlot1}
														prevSlot2={r3R2.prevSlot2}
														{draw}
														forceShowScores={true}
														textSize="text-sm"
													/>
												</div>
												<p class="font-semibold text-green-600">W</p>
											</div>
										</Accordion.ItemTrigger>
										<Accordion.ItemContent class="pb-2">
											{#if r3R2R1}
												<div class="border-primary-100 ml-12 border-l pl-4">
													<div class="flex items-center gap-4 py-3">
														<p class="w-8 shrink-0 font-semibold text-stone-500">{r3R2R1.label}</p>
														<div class="flex-1">
															<p class="text-lg font-medium">
																{getPlayerDisplayName(r3R2R1.opponentSlot)}
															</p>
															<MatchScore
																slot={r3R2R1.advancingSlot}
																prevSlot1={r3R2R1.prevSlot1}
																prevSlot2={r3R2R1.prevSlot2}
																{draw}
																forceShowScores={true}
																textSize="text-sm"
															/>
														</div>
														<p class="font-semibold text-green-600">W</p>
													</div>
												</div>
											{/if}
										</Accordion.ItemContent>
									</Accordion.Item>
								</Accordion>

								{#if r3R1}
									<div class="flex items-center gap-4 py-3">
										<p class="w-8 shrink-0 font-semibold text-stone-500">{r3R1.label}</p>
										<div class="flex-1">
											<p class="text-lg font-medium">{getPlayerDisplayName(r3R1.opponentSlot)}</p>
											<MatchScore
												slot={r3R1.advancingSlot}
												prevSlot1={r3R1.prevSlot1}
												prevSlot2={r3R1.prevSlot2}
												{draw}
												forceShowScores={true}
												textSize="text-sm"
											/>
										</div>
										<p class="font-semibold text-green-600">W</p>
									</div>
								{/if}
							</div>
						</Accordion.ItemContent>
					</Accordion.Item>
				</Accordion>
			{:else if match.opponentHistory}
				<Accordion collapsible>
					<Accordion.Item value={`${match.id}-opponent-history`}>
						<Accordion.ItemTrigger class="w-full px-6 py-4 hover:bg-stone-50 hover:text-inherit">
							<div class="flex w-full items-center gap-4 text-left">
								<p class="w-8 shrink-0 font-semibold text-stone-500">{match.label}</p>
								<div class="flex-1">
									<p class="text-lg font-medium">{getPlayerDisplayName(match.opponentSlot)}</p>
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
						</Accordion.ItemTrigger>
						<Accordion.ItemContent class="px-6 pb-4">
							<div class="border-primary-100 ml-12 border-l pl-4">
								<Accordion collapsible>
									<Accordion.Item value={`${match.opponentHistory.id}-details`}>
										<Accordion.ItemTrigger
											class="w-full py-3 text-left hover:bg-stone-50 hover:text-inherit"
										>
											<div class="flex w-full items-center gap-4">
												<p class="w-8 shrink-0 font-semibold text-stone-500">
													{match.opponentHistory.label}
												</p>
												<div class="flex-1">
													<p class="text-lg font-medium">
														{getPlayerDisplayName(match.opponentHistory.opponentSlot)}
													</p>
													<MatchScore
														slot={match.opponentHistory.advancingSlot}
														prevSlot1={match.opponentHistory.prevSlot1}
														prevSlot2={match.opponentHistory.prevSlot2}
														{draw}
														forceShowScores={true}
														textSize="text-sm"
													/>
												</div>
												<p class="font-semibold text-green-600">W</p>
											</div>
										</Accordion.ItemTrigger>
										<Accordion.ItemContent class="pb-2">
											{#if match.opponentHistory.opponentHistory}
												<div class="border-primary-100 ml-12 border-l pl-4">
													<div class="flex items-center gap-4 py-3">
														<p class="w-8 shrink-0 font-semibold text-stone-500">
															{match.opponentHistory.opponentHistory.label}
														</p>
														<div class="flex-1">
															<p class="text-lg font-medium">
																{getPlayerDisplayName(
																	match.opponentHistory.opponentHistory.opponentSlot
																)}
															</p>
															<MatchScore
																slot={match.opponentHistory.opponentHistory.advancingSlot}
																prevSlot1={match.opponentHistory.opponentHistory.prevSlot1}
																prevSlot2={match.opponentHistory.opponentHistory.prevSlot2}
																{draw}
																forceShowScores={true}
																textSize="text-sm"
															/>
														</div>
														<p class="font-semibold text-green-600">W</p>
													</div>
												</div>
											{/if}
										</Accordion.ItemContent>
									</Accordion.Item>
								</Accordion>
							</div>
						</Accordion.ItemContent>
					</Accordion.Item>
				</Accordion>
			{:else}
				<div class="flex items-center gap-4 px-6 py-4">
					<p class="w-8 shrink-0 font-semibold text-stone-500">{match.label}</p>
					<div class="flex-1">
						<p class="text-lg font-medium">{getPlayerDisplayName(match.opponentSlot)}</p>
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
			{/if}
		{/each}
		{#if matches.length === 0}
			<p class="p-6 text-center text-stone-500 italic">No early round data available.</p>
		{/if}
	</div>
</div>
