<script lang="ts">
	import Pocketbase from 'pocketbase'
	import AddPrediction from './AddPrediction.svelte'
	import ViewPrediction from './ViewPrediction.svelte'
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'
	import {
		isAuth,
		currentUsername,
		selectedUsers,
		isLeaderboard,
		predictionStore
	} from '$lib/store'
	import { type DrawPageData, type Prediction, type SelectedUser, type Slot } from '$lib/types'
	import { afterNavigate, goto } from '$app/navigation'
	import { format } from 'date-fns'
	import { addUser, getSlug, getTitle, removeUser, updatePageAuth } from '$lib/utils'
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	import HowToPlay from '$lib/HowToPlay.svelte'
	import { getPredictions } from '$lib/api'
	import { browser } from '$app/environment'
	import Cookies from 'js-cookie'
	import plus from '$lib/images/icons/plus.svg'
	import x from '$lib/images/icons/x.svg'
	import goldMedal from '$lib/images/icons/goldmedal.png'
	import silverMedal from '$lib/images/icons/silvermedal.png'
	import bronzeMedal from '$lib/images/icons/bronzemedal.png'
	import NavMenu from '$lib/NavMenu.svelte'
	export let data: DrawPageData

	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)
	const now = new Date()

	isAuth.set(data.pb_auth_valid)
	currentUsername.set(data.pb_auth_valid ? data.currentUser.username : '')
	afterNavigate(() => updatePageAuth(pb, data.pb_auth_valid, data.pb_auth_cookie))

	let isScrollListenerAdded: boolean = false
	let roundHeader: HTMLElement
	let drawGrid: HTMLElement

	const syncScroll = () => {
		roundHeader.scrollLeft = drawGrid.scrollLeft
	}

	$: if (!combinedIsLeaderboard && !isScrollListenerAdded && roundHeader && drawGrid) {
		drawGrid.addEventListener('scroll', syncScroll)
		isScrollListenerAdded = true
	}

	let serverIsLeaderboard = data.isLeaderboard === 'true'
	isLeaderboard.set(serverIsLeaderboard)
	let combinedIsLeaderboard = serverIsLeaderboard
	$: combinedIsLeaderboard = $isAuth && $isLeaderboard
	const toggleLeaderboard = (value: boolean) => {
		isLeaderboard.set(value)
		Cookies.set('isLeaderboard', value.toString(), { expires: 0.5 })
		if (value === true) {
			isScrollListenerAdded = false
		}
	}

	let combinedSelectedUsers = data.cookieSelectedUsers
	$: if (browser) {
		combinedSelectedUsers = $selectedUsers
	}
	$: users = [
		data.currentUser,
		...combinedSelectedUsers.filter((user) => user.selectorId === data.currentUser.id)
	]

	let combinedPredictions = data.predictions.items
	const updatePredictions = async (allUsers: SelectedUser[]) => {
		const predictionData = await getPredictions(data.draw.id, allUsers, pb.authStore.token)
		predictionStore.set(predictionData.items)
		combinedPredictions = $predictionStore
	}

	$: if (browser) {
		updatePredictions(users)
	}
	$: userIds = users.map((user) => user.id)

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
				currentUsername: data.currentUser.username
			}
		}
	}

	onMount(() => {
		sessionStorage.setItem('loginGoto', location.pathname)
	})
</script>

<header class="flex items-center gap-2 p-4 {headerColor}">
	<a class="rounded p-2 hover:bg-primary-200" href="/">
		<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 576 512"
			><!--! Home Icon - Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
			<path
				d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
			/>
		</svg>
	</a>
	<select
		class="select flex-grow cursor-pointer whitespace-pre-wrap border-none bg-transparent text-lg font-bold hover:bg-primary-200 md:text-3xl"
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
		class="ml-auto flex w-fit flex-none flex-col flex-wrap items-center justify-end gap-4 pl-2 sm:flex-row-reverse sm:self-start"
	>
		<NavMenu />
		<HowToPlay />
	</div>
</header>
<section class="grid grid-cols-4 gap-2 p-4 {headerColor} [&>*]:text-lg">
	<div class="col-span-4 text-center text-black sm:col-span-1">
		Active Round: <span class="font-bold">{roundLabel}</span>
	</div>
	<div class="col-span-4 text-center text-black sm:col-span-1">
		{predictionsAllowed ? 'Predictions open until: ' : 'Predictions closed: '}<span
			class="font-bold">{predictionClose}</span
		>
	</div>
	{#if $isAuth}
		<div
			class="col-span-4 flex flex-col items-center justify-center gap-2 sm:col-span-2 sm:flex-row sm:justify-between"
		>
			<div class="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
				<p>Users:</p>
				{#each users as user}
					<div
						class="chip pointer-events-none relative h-6 rounded-full text-black {user.color} shadow duration-0"
						data-testid={`User_${user.username}`}
					>
						<p>{user.username}</p>
						<div
							class="badge-icon absolute -right-1.5 -top-1.5 z-10 h-4 w-fit rounded-full bg-green-400 px-1 text-sm"
							data-testid={`UserPoints_${user.username}`}
						>
							<p>
								{combinedPredictions
									.filter((p) => p.user_id === user.id)
									.map((p) => p.points)
									.reduce((a, b) => a + b, 0)}
							</p>
						</div>
					</div>
				{/each}
				<button
					class="chip flex h-6 justify-center rounded-full border border-dashed border-black hover:bg-primary-100"
					on:click={() => modalStore.trigger(modal)}
				>
					<svg
						class="mb-0.5 ml-0.5 fill-black"
						xmlns="http://www.w3.org/2000/svg"
						height="1rem"
						viewBox="0 0 512 512"
					>
						<!--! Pencil Icon - Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
						<path
							d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
						/>
					</svg>
				</button>
			</div>
			<div class="flex min-w-fit overflow-hidden rounded-md" data-testid="LeaderboardToggle">
				<button
					class={`px-3 py-1 text-sm ${combinedIsLeaderboard ? 'bg-primary-300' : 'bg-primary-500 text-white'}`}
					on:click={() => toggleLeaderboard(false)}>Draw</button
				>
				<button
					class={`px-3 py-1 text-sm ${combinedIsLeaderboard ? 'bg-primary-500 text-white' : 'bg-primary-300'}`}
					on:click={() => toggleLeaderboard(true)}>Leaderboard</button
				>
			</div>
		</div>
	{:else}
		<p class="col-span-4 text-center italic sm:col-span-2">Log in to play!</p>
	{/if}
</section>
<main>
	{#if combinedIsLeaderboard}
		<div
			class="z-10 mx-auto grid grid-cols-5 text-center text-lg [&>div]:flex [&>div]:items-center [&>div]:justify-center"
			data-testid="Leaderboard"
		>
			<div class="sticky top-0 z-20 bg-primary-300 py-2 font-bold">Rank</div>
			<div class="sticky top-0 z-20 col-span-2 bg-primary-300 py-2 font-bold">Username</div>
			<div class="sticky top-0 z-20 bg-primary-300 py-2 font-bold">Points</div>
			<div class="sticky top-0 z-20 bg-primary-300 py-2 font-bold">Action</div>
			{#if data.leaderboard.items.length > 0}
				{#each data.leaderboard.items as lb, index}
					{@const selectedUser = users.find((u) => u.id === lb.user_id)}
					{@const rowStyle = `py-4 ${index % 2 ? 'bg-stone-200' : 'bg-stone-100'}`}
					<div class={rowStyle}>
						{#if lb.rank === 1}
							<img class="rounded-full shadow" src={goldMedal} alt="gold medal" width="40" />
						{:else if lb.rank === 2}
							<img class="rounded-full shadow" src={silverMedal} alt="silver medal" width="40" />
						{:else if lb.rank === 3}
							<img class="rounded-full shadow" src={bronzeMedal} alt="bronze medal" width="40" />
						{:else}
							<p class="text-2xl font-extrabold">{lb.rank}</p>
						{/if}
					</div>
					<div class={`col-span-2 ${rowStyle}`}>
						<div
							class={`chip pointer-events-none rounded-full text-lg ${selectedUser ? `shadow ${selectedUser.color}` : ''}`}
						>
							{lb.username}
						</div>
					</div>
					<div class={rowStyle}>
						<div class="badge-icon mx-auto h-6 w-fit rounded-full bg-green-400 px-2 text-lg">
							{lb.total_points}
						</div>
					</div>
					<div class={rowStyle}>
						{#if selectedUser?.id === data.currentUser.id}
							<p>N/A</p>
						{:else if combinedSelectedUsers.find((u) => u.id === lb.user_id)}
							<button
								on:click={() => removeUser(lb.user_id)}
								class="mx-auto flex h-6 items-center justify-center gap-2 rounded-lg bg-red-200 px-2 py-1 sm:h-fit"
							>
								<p class="hidden sm:block">Remove</p>
								<img src={x} alt="plus icon" width="12" />
							</button>
						{:else}
							{@const newUser = {
								selectorId: data.currentUser.id,
								id: lb.user_id,
								username: lb.username
							}}
							<button
								on:click={() => addUser(newUser)}
								class={`mx-auto flex h-6 items-center justify-center gap-2 rounded-lg bg-green-300 px-2 py-1 sm:h-fit ${
									combinedSelectedUsers.length >= 5 ? 'cursor-not-allowed opacity-50' : ''
								}`}
								disabled={combinedSelectedUsers.length >= 5}
							>
								<p class="hidden sm:block">Add</p>
								<img src={plus} alt="plus icon" width="12" />
							</button>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="col-span-5 py-4 text-center">No points awarded yet. Stay tuned!</div>
			{/if}
		</div>
	{:else}
		<div data-testid="Draw">
			<div
				class="sticky top-0 z-20 overflow-x-hidden {headerColor} font-semibold tracking-wide shadow [&>*]:text-lg"
				bind:this={roundHeader}
			>
				<div class="grid" style:grid-template-columns={'repeat(5, minmax(200px, 1fr))'}>
					{#each Object.entries(pointsByRound) as [round, points]}
						<div class="flex justify-center gap-2 bg-primary-300 py-2 text-center">
							<p>{round}</p>
							{#if points > 0}
								<div class="aspect-square h-full rounded-full bg-green-400 shadow">{points}</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
			<div
				class="relative grid overflow-x-auto overscroll-x-none bg-stone-100 pb-12"
				style:grid-template-columns={'repeat(5, minmax(200px, 1fr))'}
				bind:this={drawGrid}
			>
				{#each ourRounds as round, index}
					<div class="column">
						{#each slots.filter((slot) => slot.round === round) as slot}
							<div
								class="relative flex items-end justify-center border-b-2 border-black text-center"
								class:border-r-2={!(slot.position % 2)}
								style:height={getHeight(index, slot.position)}
							>
								{#if slot.name.trim()}
									<p class="text-lg" data-testid={`SlotR${slot.round}P${slot.position}`}>
										{`${slot.seed} ${slot.name}`}
									</p>
								{:else}
									<p
										class="text-lg italic text-surface-800"
										data-testid={`SlotR${slot.round}P${slot.position}`}
									>
										TBD
									</p>
								{/if}
								{#if $isAuth && index > 0}
									{@const slotPredictions = combinedPredictions
										.filter((p) => p.draw_slot_id === slot.id)
										.sort((a, b) => userIds.indexOf(a.user_id) - userIds.indexOf(b.user_id))}
									{@const currentUserPrediction = slotPredictions.find(
										(p) => p.user_id === data.currentUser.id
									)}
									{@const selectedUserPredictions = slotPredictions.filter(
										(p) => p.user_id !== data.currentUser.id
									)}
									{@const players = getPlayerOptions(slot, combinedPredictions, index)}
									<div
										class="absolute bottom-0 z-10 flex h-20 w-full translate-y-full flex-wrap content-start justify-center gap-2 p-1.5"
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
			</div>
		</div>
	{/if}
</main>
