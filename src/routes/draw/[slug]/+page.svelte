<script lang="ts">
	import Pocketbase from 'pocketbase'
	import AddPrediction from './AddPrediction.svelte'
	import ViewPrediction from './ViewPrediction.svelte'
	import Logout from '$lib/Logout.svelte'
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'
	import { isAuth, predictionStore } from '$lib/store'
	import type { Prediction, Slot } from '$lib/types'
	import { afterNavigate, goto } from '$app/navigation'
	import { format } from 'date-fns'
	import { getSlug, getTitle, updatePageAuth } from '$lib/utils'
	import { fade } from 'svelte/transition'
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	import HowToPlay from '$lib/HowToPlay.svelte'
	export let data

	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)
	const now = new Date()

	isAuth.set(data.pb_auth_valid)
	afterNavigate(() => updatePageAuth(pb, data.pb_auth_valid, data.pb_auth_cookie))

	const headerColor = 'bg-primary-50'
	const pointsByRound = {
		'Round of 16': 0,
		Quarterfinals: 1,
		Semifinals: 2,
		Final: 4,
		Champion: 8
	}

	$: fullDrawRounds = Math.log2(data.draw.size) + 1
	$: allRounds = [...Array(fullDrawRounds).keys()].map((x) => x + 1) // rounds start at 1
	$: ourRounds = allRounds.slice(-5)
	$: slots = data.slots.items.filter((slot) => slot.round >= fullDrawRounds - 4)

	let pcDate: Date | undefined
	let predictionClose: string
	let predictionsAllowed: boolean
	$: if (data.draw.prediction_close) {
		pcDate = new Date(data.draw.prediction_close)
		predictionClose = format(pcDate, 'M/d/yyyy h:mmaaa')
		predictionsAllowed = now < pcDate
	} else {
		pcDate = undefined
		predictionClose = '12h after R16 is full'
		predictionsAllowed = true
	}

	$: predictionStore.set(data.predictions.items)
	$: users = [data.currentUser, ...data.selectedUsers].filter(Boolean)
	$: userIds = users.map((user) => user.id)
	$: roundLabel = (() => {
		const filledRounds = allRounds.filter((round) => {
			return data.slots.items
				.filter((slot) => {
					return slot.round === round
				})
				.every((slot) => slot.name.trim() !== '')
		})

		if (filledRounds.at(-1) === fullDrawRounds) {
			return 'Tournament Completed'
		}

		const activeRound = Math.max(0, ...filledRounds) // round being played
		const labels = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final']
		const index = ourRounds.indexOf(activeRound)

		if (index !== -1) {
			return labels[index]
		} else {
			const sizeLabel = `(R${2 ** (fullDrawRounds - activeRound)})`
			const earlyLabels = [
				'Qualifying Rounds',
				`1st Round ${sizeLabel}`,
				`2nd Round ${sizeLabel}`,
				`3rd Round ${sizeLabel}`
			]
			return `${earlyLabels[activeRound]}`
		}
	})()

	const colorMap: Map<string, string> = new Map()
	$: users.forEach((user) => colorMap.set(user.id, user.color))
	const getColor = (userId: string | undefined) => colorMap.get(userId ?? '') ?? 'bg-white'

	let drawUrl = ''
	$: if (drawUrl) {
		goto(drawUrl, { invalidateAll: true })
		sessionStorage.setItem('loginGoto', drawUrl)
	}

	const getHeight = (roundIndex: number, position: number): string => {
		let rems = 0
		if (position === 1) {
			rems = 2 ** (roundIndex - 1) * 4 + 2
		} else {
			rems = 2 ** roundIndex * 4
		}
		return `${rems}rem`
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
				player1 = `${slot1.seed} ${slot1.name}`.trim()
			}
			if (slot2) {
				player2 = `${slot2.seed} ${slot2.name}`.trim()
			}
		}

		return [player1, player2]
	}

	let roundHeader: HTMLElement
	let drawGrid: HTMLElement
	onMount(() => {
		sessionStorage.setItem('loginGoto', location.pathname)

		if (roundHeader && drawGrid) {
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
			backdropClasses: 'bg-surface-500',
			meta: {
				currentUserId: data.currentUser.id,
				currentUsername: data.currentUser.username,
				selectedUsers: data.selectedUsers
			}
		}
	}
</script>

<header class="flex items-center p-4 gap-2 {headerColor}">
	<a class="hover:bg-primary-200 p-2 rounded" href="/">
		<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 576 512"
			><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
				d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
			/></svg
		>
	</a>
	<select
		class="select flex-grow bg-transparent text-lg md:text-3xl font-bold border-none cursor-pointer whitespace-pre-wrap hover:bg-primary-200"
		on:change={(e) => (drawUrl = e.currentTarget.value)}
	>
		<option disabled>Active Draws</option>
		{#each data.active.items as draw}
			<option selected={data.draw.id === draw.id} value={`/draw/${getSlug(draw)}`}
				>{getTitle(draw)}</option
			>
		{/each}
		<option disabled>Completed Draws</option>
		{#each data.completed.items as draw}
			<option selected={data.draw.id === draw.id} value={`/draw/${getSlug(draw)}`}
				>{getTitle(draw)}</option
			>
		{/each}
	</select>
	<div
		class="w-fit ml-auto flex-none flex flex-col sm:flex-row sm:self-start justify-end items-center gap-2 flex-wrap"
	>
		<HowToPlay />
		{#if $isAuth}
			<Logout />
		{:else}
			<a href="/login">
				<button type="button" class="btn btn-sm md:btn-md bg-black text-white rounded-lg"
					>Login</button
				>
			</a>
			<a href="/create-account">
				<button type="button" class="btn btn-sm md:btn-md bg-black text-white rounded-lg"
					>Sign up</button
				>
			</a>
		{/if}
	</div>
</header>
<section class="grid grid-cols-3 gap-2 p-4 {headerColor} [&>*]:text-lg">
	<div class="col-span-3 sm:col-span-1 text-center text-black">
		Active Round: <span class="font-bold">{roundLabel}</span>
	</div>
	<div class="col-span-3 sm:col-span-1 text-center text-black">
		{predictionsAllowed ? 'Predictions open until: ' : 'Predictions closed: '}<span
			class="font-bold">{predictionClose}</span
		>
	</div>
	{#if $isAuth}
		<div class="col-span-3 sm:col-span-1 flex flex-wrap gap-2 justify-center">
			<p>Users:</p>
			{#each users as user}
				<div
					class="relative chip h-6 rounded-full pointer-events-none text-black {user.color} shadow"
					transition:fade={{ duration: 100 }}
				>
					<p>{user.username}</p>
					<div
						class="absolute badge-icon -top-1.5 -right-1.5 rounded-full h-4 w-fit px-1 text-sm bg-green-400 z-10"
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
				class="chip h-6 border border-black border-dashed rounded-full flex justify-center hover:bg-primary-100"
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
		</div>
	{:else}
		<p class="italic text-center col-span-3 sm:col-span-1">Log in to play!</p>
	{/if}
</section>
<section
	class="sticky top-0 z-20 overflow-x-hidden {headerColor} shadow [&>*]:text-lg font-semibold tracking-wide"
	bind:this={roundHeader}
>
	<div class="grid" style:grid-template-columns={'repeat(5, minmax(200px, 1fr))'}>
		{#each Object.entries(pointsByRound) as [round, points]}
			<div class="bg-primary-300 text-center py-2 flex justify-center gap-2">
				<p>{round}</p>
				{#if points > 0}
					<div class="bg-green-400 rounded-full aspect-square h-full shadow">{points}</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
<main
	class="relative grid overflow-x-auto overscroll-x-none pb-12 bg-stone-100"
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
					{#if slot.name.trim()}
						<p class="text-lg">{`${slot.seed} ${slot.name}`}</p>
					{:else}
						<p class="text-lg italic text-surface-800">TBD</p>
					{/if}
					{#if $isAuth && index > 0}
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
