<script lang="ts">
	import Pocketbase from 'pocketbase'
	import AddPrediction from './AddPrediction.svelte'
	import ViewPrediction from './ViewPrediction.svelte'
	import Logout from '$lib/Logout.svelte'
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'
	import { predictionStore } from '$lib/store'
	import type { Prediction, Slot } from '$lib/types'
	import Cookies from 'js-cookie'
	import { afterNavigate } from '$app/navigation'
	import { format } from 'date-fns'
	export let data

	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let isAuth = data.isAuthServer
	afterNavigate(() => {
		isAuth = pb.authStore.isValid
		if (!isAuth) {
			Cookies.remove('pb_auth')
		}
	})

	const title = `${data.draw.name} ${data.draw.event} ${data.draw.year}`
	const fullDrawRounds = Math.log2(data.draw.size) + 1
	const allRounds = [...Array(fullDrawRounds).keys()].map((x) => x + 1)
	const ourRounds = allRounds.slice(-5)
	const slots = data.slots.items.filter((slot) => slot.round >= fullDrawRounds - 4)
	const now = new Date()
	const pcDate = new Date(data.draw.prediction_close)
	const predictionClose = format(pcDate, 'M/dd/yyyy h:mmaaa')
	$: predictionsAllowed = now < pcDate
	$: predictionStore.set(data.predictions.items)
	$: users = [data.currentUser, ...data.selectedUsers].filter(Boolean)
	$: userIds = users.map((user) => user.id)

	const colorMap: Map<string, string> = new Map()
	$: users.forEach((user) => colorMap.set(user.id, user.color))
	const getColor = (userId: string | undefined) => colorMap.get(userId ?? '') ?? 'bg-white'

	const getHeight = (roundIndex: number, position: number): string => {
		let rems = 0
		if (position === 1) {
			rems = 2 ** (roundIndex - 1) * 4 + 2
		} else {
			rems = 2 ** roundIndex * 4
		}
		return `${rems}rem`
	}

	const getRoundLabel = () => {
		const tbdRounds = allRounds.filter((round) => {
			return slots
				.filter((slot) => {
					return slot.round === round
				})
				.some((slot) => slot.name.trim() === '')
		})

		if (tbdRounds.length === 0) {
			return 'Tournament Completed'
		}

		const activeRound = Math.min(...tbdRounds) - 1

		const labels = [
			'Current Round: Round of 16',
			'Current Round: Quarterfinals',
			'Current Round: Semifinals',
			'Current Round: Finals'
		]
		const index = ourRounds.indexOf(activeRound)

		if (index !== -1) {
			return labels[index]
		} else {
			const earlyLabels = ['1st Round', '2nd Round', '3rd Round']
			return `Current Round: ${earlyLabels[activeRound - 1]}`
		}
	}

	const getPlayerOptions = (
		slot: Slot,
		predictions: Prediction[],
		index: number
	): [string, string] => {
		let player1 = ''
		let player2 = ''
		const round = slot.round
		const position = slot.position

		if (index > 1) {
			const prediction1 = predictions.find(
				(p) =>
					p.user_id === data.currentUser.id &&
					p.round === round - 1 &&
					p.position === position * 2 - 1
			)
			const prediction2 = predictions.find(
				(p) =>
					p.user_id === data.currentUser.id && p.round === round - 1 && p.position === position * 2
			)

			if (prediction1) {
				player1 = prediction1.name
			}
			if (prediction2) {
				player2 = prediction2.name
			}
		} else {
			const slot1 = slots.find((s) => s.round === round - 1 && s.position === position * 2 - 1)
			const slot2 = slots.find((s) => s.round === round - 1 && s.position === position * 2)

			if (slot1) {
				player1 = `${slot1.seed} ${slot1.name}`
			}
			if (slot2) {
				player2 = `${slot2.seed} ${slot2.name}`
			}
		}

		return [player1, player2]
	}

	let roundHeader: HTMLElement
	let drawGrid: HTMLElement
	onMount(() => {
		if (roundHeader && drawGrid) {
			roundHeader.addEventListener('scroll', () => {
				drawGrid.scrollLeft = roundHeader.scrollLeft
			})

			drawGrid.addEventListener('scroll', () => {
				roundHeader.scrollLeft = drawGrid.scrollLeft
			})
		}
	})

	const modalStore = getModalStore()
	let modal: ModalSettings
	$: if (isAuth) {
		modal = {
			type: 'component',
			component: 'selectUsers',
			title: 'Select Users',
			body: 'Compare predictions with your friends (max of 6 total)',
			meta: {
				currentUserId: data.currentUser.id,
				currentUsername: data.currentUser.username,
				selectedUsers: data.selectedUsers
			}
		}
	}
</script>

<header class="grid grid-cols-4 items-center">
	<h1 class="col-span-3 text-lg md:text-2xl font-bold ml-4">{`Tennis Bracket - ${title}`}</h1>
	<div class="col-span-1 flex justify-end gap-2 flex-wrap p-2">
		{#if isAuth}
			<Logout />
		{:else}
			<a href="/login">
				<button type="button" class="btn btn-sm md:btn-md variant-ghost rounded-lg">Login</button>
			</a>
			<a href="/create-account">
				<button type="button" class="btn btn-sm md:btn-md variant-filled rounded-lg">Sign up</button
				>
			</a>
		{/if}
	</div>
	{#if predictionsAllowed}
		<div class="col-span-4 flex justify-around text-sm text-center bg-green-500 py-1">
			<p>{getRoundLabel()}</p>
			<p>Predictions open until <span class="font-bold text-black">{predictionClose}</span></p>
		</div>
	{:else}
		<div class="col-span-4 flex justify-around text-sm text-center bg-red-500 py-1">
			<p>{getRoundLabel()}</p>
			<p>Predictions closed <span class="font-bold text-black">{predictionClose}</span></p>
		</div>
	{/if}
</header>
<section class="flex gap-2 ml-6 my-2 h-6">
	{#if isAuth}
		<p>Users:</p>
		{#each users as user}
			<div class={`relative chip rounded-full pointer-events-none text-black ${user.color} shadow`}>
				<p>{user.username}</p>
				<div
					class="absolute badge-icon -top-1 -right-2 rounded-full aspect-square h-4 text-sm bg-green-400 z-10"
				>
					<p>
						{$predictionStore
							.filter((p) => p.user_id === user.id)
							.map((p) => p.points)
							.reduce((a, b) => a + b, 0)}
					</p>
				</div>
			</div>
		{/each}
		<button
			class="chip border border-black border-dashed rounded-full flex justify-center"
			on:click={() => modalStore.trigger(modal)}
		>
			<svg
				class="fill-black ml-0.5 mb-0.5"
				xmlns="http://www.w3.org/2000/svg"
				height="1rem"
				viewBox="0 0 512 512"
				><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
					d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
				/></svg
			>
		</button>
	{:else}
		<p class="italic w-full text-right mr-2">Log in to play!</p>
	{/if}
</section>
<section
	class="sticky top-0 z-20 border-y-2 border-black overflow-auto overflow-x-hidden"
	bind:this={roundHeader}
>
	<div class="grid" style:grid-template-columns={'repeat(5, minmax(200px, 1fr))'}>
		<div class="bg-white text-center py-2">Round of 16</div>
		<div class="bg-white text-center py-2">Quarterfinals</div>
		<div class="bg-white text-center py-2">Semifinals</div>
		<div class="bg-white text-center py-2">Final</div>
		<div class="bg-white text-center py-2">Champion</div>
	</div>
</section>
<main
	class="relative grid overflow-x-auto pb-24"
	style:grid-template-columns={'repeat(5, minmax(200px, 1fr))'}
	bind:this={drawGrid}
>
	{#each ourRounds as round, index}
		<div class="column">
			{#each slots.filter((slot) => slot.round === round) as slot}
				<div
					class="relative flex justify-center items-end text-center border-b-2 border-black"
					class:border-r-2={!(slot.position % 2)}
					style:height={getHeight(index, slot.position)}
				>
					<p>{`${slot.seed} ${slot.name}`}</p>
					{#if isAuth && index > 0}
						{@const slotPredictions = $predictionStore
							.filter((p) => p.draw_slot_id === slot.id)
							.sort((a, b) => userIds.indexOf(a.user_id) - userIds.indexOf(b.user_id))}
						{@const currentUserPrediction = slotPredictions.find(
							(p) => p.user_id === data.currentUser.id
						)}
						{@const selectedUserPredictions = slotPredictions.filter(
							(p) => p.user_id !== data.currentUser.id
						)}
						{@const players = getPlayerOptions(slot, $predictionStore, index)}
						<div
							class="absolute bottom-0 translate-y-full h-20 w-full p-1.5 flex flex-wrap justify-center content-start gap-2 z-10"
						>
							<AddPrediction
								{slot}
								roundIndex={index}
								{players}
								prediction={currentUserPrediction}
								{getColor}
								{predictionsAllowed}
							/>
							{#each selectedUserPredictions as prediction}
								<ViewPrediction {prediction} {getColor} />
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</main>
