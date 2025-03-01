<script lang="ts">
	import Pocketbase from 'pocketbase'
	import AddPrediction from './AddPrediction.svelte'
	import ViewPrediction from './ViewPrediction.svelte'
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
	import {
		isAuth,
		mySelectedUsers,
		isLeaderboard,
		predictionStore,
		drawNavUrl,
		loginGoto,
		currentDrawId,
		predictionsError
	} from '$lib/store'
	import { type DrawPageData, type Prediction, type SelectedUser, type Slot } from '$lib/types'
	import { afterNavigate, goto } from '$app/navigation'
	import { format } from 'date-fns'
	import { addUser, getSlug, getTitle, removeUser } from '$lib/utils'
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	import { getPredictions } from '$lib/api'
	import { browser } from '$app/environment'
	import Cookies from 'js-cookie'
	import plus from '$lib/images/icons/plus.svg'
	import edit from '$lib/images/icons/pen-to-square.svg'
	import x from '$lib/images/icons/x.svg'
	import Rank from '$lib/components/Rank.svelte'
	import Header from '$lib/components/Header.svelte'
	import { customSlide } from '$lib/utils'
	import MatchScore from '$lib/components/MatchScore.svelte'
	import { exampleSelectedUsers } from '$lib/data'
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	interface Props {
		data: DrawPageData
	}

	let { data }: Props = $props()

	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

	//////////////////////////////////////////
	// PAGE SETUP
	//////////////////////////////////////////

	const headerColor = 'bg-primary-50'
	const pointsByRound = {
		'Round of 16': 0,
		Quarterfinals: 1,
		Semifinals: 2,
		Final: 4,
		Champion: 8
	}

	let roundHeader: HTMLElement | null = $state(null)
	let drawGrid: HTMLElement | null = $state(null)

	// sync horizontal scroll between roundHeader and drawGrid
	const syncScroll = () => {
		if (roundHeader && drawGrid) {
			roundHeader.scrollLeft = drawGrid.scrollLeft
		}
	}

	let serverIsLeaderboard = data.isLeaderboard
	isLeaderboard.set(serverIsLeaderboard)
	let combinedIsLeaderboard = $derived(browser ? $isLeaderboard : serverIsLeaderboard)

	const toggleLeaderboard = (value: boolean) => {
		isLeaderboard.set(value)
		Cookies.set('isLeaderboard', value.toString(), { expires: 0.5 })
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

	// dates handled on the client side to display the correct time for the user's timezone
	let now = $derived(new Date())
	let predictionCloseFormatted = $derived(
		data.draw.prediction_close
			? format(data.draw.prediction_close, 'MMM d, yyyy h:mmaaa')
			: '12h after R16 is full'
	)
	let predictionsAllowed = $derived(
		!data.draw.prediction_close || now < new Date(data.draw.prediction_close)
	)

	let innerWidth = $state(0)
	let drawHeight = $state(0)
	let leaderboardHeight = $state(0)
	let mainHeight = $derived(combinedIsLeaderboard ? leaderboardHeight : drawHeight)

	//////////////////////////////////////////
	// USER SETUP
	//////////////////////////////////////////

	let users: SelectedUser[] = $derived.by(() => {
		if ($isAuth) {
			if (browser) {
				return [data.currentUser, ...$mySelectedUsers]
			} else {
				return [data.currentUser]
			}
		} else {
			return exampleSelectedUsers
		}
	})

	let userIds = $derived(users.map((user) => user.id))
	let predictions = $derived($predictionStore ?? [])
	let userPoints = $derived(
		users.map((user) => ({
			id: user.id,
			points: predictions
				.filter((p) => p.user_id === user.id)
				.map((p) => p.points)
				.reduce((a, b) => a + b, 0)
		}))
	)
	const getUserPoints = (userId: string) => userPoints.find((u) => u.id === userId)?.points ?? 0

	//////////////////////////////////////////
	// DRAW SETUP
	//////////////////////////////////////////

	let fullDrawRounds = $derived(Math.log2(data.draw.size) + 1)
	let allRounds = $derived([...Array(fullDrawRounds).keys()].map((x) => x + 1))
	let ourRounds = $derived(allRounds.slice(-5))

	let roundLabel = $derived(
		(() => {
			const filledRounds = allRounds.filter((round) => {
				return data.slots
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
	)

	onMount(() => {
		getAllUserPredictions()
	})
	afterNavigate(() => {
		const url = `/draw/${getSlug(data.draw)}`
		drawNavUrl.set(url)
		loginGoto.set(url)
		currentDrawId.set(data.draw.id)
		getAllUserPredictions()
	})

	//////////////////////////////////////////
	// SLOT SETUP
	//////////////////////////////////////////

	interface SlotRenderData {
		slotId: string
		slotPredictions: Prediction[]
		currentUserPrediction: Prediction | undefined
		selectedUserPredictions: Prediction[]
	}

	let slots = $derived(data.slots.filter((slot) => slot.round >= fullDrawRounds - 4))
	let slotRenderData: SlotRenderData[] = $derived(
		slots.map((slot) => {
			if (!predictions.length) {
				return {
					slotId: slot.id,
					slotPredictions: [],
					currentUserPrediction: undefined,
					selectedUserPredictions: []
				}
			}

			const slotPredictions = predictions
				.filter((p) => p.draw_slot_id === slot.id)
				.sort((a, b) => userIds.indexOf(a.user_id) - userIds.indexOf(b.user_id))

			return {
				slotId: slot.id,
				slotPredictions,
				currentUserPrediction: slotPredictions.find((p) => p.user_id === data.currentUser.id),
				selectedUserPredictions: slotPredictions.filter((p) => p.user_id !== data.currentUser.id)
			}
		})
	)

	const getSlotRenderData = (slot: Slot) => slotRenderData.find((s) => s.slotId === slot.id)

	const getPlayerOptions = (slot: Slot, index: number): [string, string] => {
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
			const slot1 = data.slots.find((s) => s.round === round - 1 && s.position === position * 2 - 1)
			const slot2 = data.slots.find((s) => s.round === round - 1 && s.position === position * 2)

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
	let modal: ModalSettings = $derived(
		$isAuth
			? {
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
			: ({} as ModalSettings)
	)

	//////////////////////////////////////////
	// UPDATE PREDICTIONS
	//////////////////////////////////////////

	let predictionsLoading = $state(false)

	const colorMap: Map<string, string> = $derived(
		new Map(users.map((user) => [user.id, user.color]))
	)

	const getAllUserPredictions = async () => {
		predictionsLoading = true

		try {
			const predictionRecords = await getPredictions(data.draw.id, users, pb.authStore.token)
			const predictions: Prediction[] = predictionRecords.items.map((p) => ({
				...p,
				color: colorMap.get(p.user_id) ?? 'bg-white'
			}))
			predictionStore.set(predictions)
			predictionsError.set('')
		} catch (error) {
			predictionsError.set(
				`Error: ${error instanceof Error ? error.message : 'Failed to load predictions'}`
			)
		} finally {
			predictionsLoading = false
		}
	}
</script>

<svelte:window bind:innerWidth />

<Header color="bg-primary-50">
	<select
		class="select flex-grow cursor-pointer whitespace-pre-wrap border-none bg-transparent px-1 py-0 font-PoetsenOne text-xl hover:bg-primary-200 md:text-2xl"
		onchange={(e) => goto(e.currentTarget.value)}
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
</Header>
<section class="grid grid-cols-4 items-start gap-2 px-4 pb-4 {headerColor} [&>*]:text-lg">
	<div class="col-span-4 text-center md:col-span-1 md:text-start">
		Dates: <span class="font-bold"
			>{format(data.draw.start_date, 'MMM d, yyyy')} - {format(
				data.draw.end_date,
				'MMM d, yyyy'
			)}</span
		>
	</div>
	<div class="col-span-4 text-center text-black md:col-span-1 md:text-start">
		{predictionsAllowed ? 'Predictions open until: ' : 'Predictions closed: '}<span
			class="font-bold">{predictionCloseFormatted}</span
		>
	</div>
	<div class="col-span-4 text-center text-black md:col-span-1">
		Active Round: <span class="font-bold">{roundLabel}</span>
	</div>
	<div
		class="col-span-4 mx-auto flex w-fit overflow-x-hidden rounded-md md:col-span-1"
		data-testid="LeaderboardToggle"
	>
		<button
			class={`px-3 py-1 text-sm ${combinedIsLeaderboard ? 'bg-primary-300 hover:brightness-105' : 'bg-primary-500 text-white'}`}
			onclick={() => toggleLeaderboard(false)}>Draw</button
		>
		<button
			class={`px-3 py-1 text-sm ${combinedIsLeaderboard ? 'bg-primary-500 text-white' : 'bg-primary-300 hover:brightness-105'}`}
			onclick={() => toggleLeaderboard(true)}>Leaderboard</button
		>
	</div>
	<div class="col-span-4 mt-1 flex flex-wrap items-center justify-center gap-2 md:justify-start">
		<p>Users:</p>
		{#each users as user}
			<button
				type="button"
				class="chip relative h-6 max-w-full rounded-full text-black {user.color} shadow duration-0"
				onclick={() => goto(`/profile/${user.username}`)}
				data-testid={`User_${user.username}`}
			>
				<p class="truncate text-ellipsis">{user.username}</p>
				<div
					class="badge-icon absolute -right-1.5 -top-1.5 z-10 h-4 w-fit rounded-full bg-green-400 px-1 text-sm"
					data-testid={`UserPoints_${user.username}`}
				>
					<p>
						{getUserPoints(user.id)}
					</p>
				</div>
			</button>
		{/each}
		<button
			class="chip flex h-6 justify-center rounded-full border border-dashed border-black hover:bg-primary-100"
			onclick={() => modalStore.trigger(modal)}
			disabled={!$isAuth}
		>
			<img src={edit} alt="edit icon" width="16" class="mb-0.5 ml-0.5" />
		</button>
		{#if !$isAuth}
			<p class="text-sm italic">Log in to select</p>
		{/if}
		{#if $predictionsError}
			<p class="text-red-500">{$predictionsError}</p>
		{/if}
	</div>
</section>
<main class="relative" style="height: {mainHeight}px; clip-path: inset(0)">
	{#if combinedIsLeaderboard}
		<div
			class="absolute mx-auto grid w-full shrink-0 grid-cols-5 text-center text-lg [&>div]:flex [&>div]:items-center [&>div]:justify-center"
			transition:customSlide={{ x: innerWidth }}
			bind:offsetHeight={leaderboardHeight}
			data-testid="Leaderboard"
		>
			<div class="sticky top-0 z-20 bg-primary-300 py-2 font-bold">Rank</div>
			<div class="sticky top-0 z-20 col-span-2 bg-primary-300 py-2 font-bold">User</div>
			<div class="sticky top-0 z-20 bg-primary-300 py-2 font-bold">Points</div>
			<div class="sticky top-0 z-20 bg-primary-300 py-2 font-bold">Select</div>
			{#if data.drawResults.items.length > 0}
				{#each data.drawResults.items as result, index}
					{@const selectedUser = users.find((u) => u.id === result.user_id)}
					{@const rowStyle = `py-4 ${index % 2 ? 'bg-stone-200' : 'bg-stone-100'}`}
					<div class={rowStyle}>
						<Rank rank={result.rank} containerStyle="w-10" textStyle="text-2xl font-extrabold" />
					</div>
					<div class={`col-span-2 ${rowStyle}`}>
						<!-- rounded-3xl instead of full to handle multiline names -->
						<button
							type="button"
							class={`rounded-3xl px-3 py-1 ${selectedUser ? `shadow ${selectedUser.color} hover:brightness-105` : 'hover:underline'}`}
							onclick={() => goto(`/profile/${result.username}`)}
						>
							<p class="break-all text-lg">
								{result.username}
							</p>
						</button>
					</div>
					<div class={rowStyle}>
						<div class="badge-icon mx-auto h-6 w-fit rounded-full bg-green-400 px-2 text-lg">
							{result.total_points}
						</div>
					</div>
					<div class={rowStyle}>
						{#if selectedUser?.id === data.currentUser.id}
							<p>N/A</p>
						{:else if ($isAuth && $mySelectedUsers.find((u) => u.id === result.user_id)) || (!$isAuth && ['will', 'TereseM'].includes(result.username))}
							{@const isDisabled = !$isAuth}
							<button
								onclick={() => removeUser(result.user_id)}
								class="mx-auto flex h-6 items-center justify-center gap-2 rounded-lg bg-red-200 px-2 py-1 hover:brightness-105 md:h-fit ${isDisabled
									? 'cursor-not-allowed opacity-50'
									: ''}"
								disabled={isDisabled}
							>
								<p class="hidden md:block">Remove</p>
								<img src={x} alt="plus icon" width="12" />
							</button>
						{:else}
							{@const newUser = {
								selectorId: data.currentUser.id,
								id: result.user_id,
								username: result.username
							}}
							{@const isDisabled = $mySelectedUsers.length >= 5 || !$isAuth}
							<button
								onclick={() => addUser(newUser)}
								class={`mx-auto flex h-6 items-center justify-center gap-2 rounded-lg bg-green-300 px-2 py-1 hover:brightness-105 md:h-fit ${
									isDisabled ? 'cursor-not-allowed opacity-50' : ''
								}`}
								disabled={isDisabled}
							>
								<p class="hidden md:block">Add</p>
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
		<div
			class="absolute w-full"
			transition:customSlide={{ x: -innerWidth }}
			bind:offsetHeight={drawHeight}
			data-testid="Draw"
		>
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
				onscroll={syncScroll}
			>
				{#each ourRounds as round, index}
					<div class="column">
						{#each slots.filter((slot) => slot.round === round) as slot}
							<div
								class="relative flex flex-col items-center justify-end border-b-2 border-black pb-1 text-center"
								class:border-r-2={!(slot.position % 2)}
								style:height={getHeight(index, slot.position)}
							>
								{#if slot.name.trim()}
									{@const prevSlot1 = slots.find(
										(s) => s.round === slot.round - 1 && s.position === slot.position * 2 - 1
									)}
									{@const prevSlot2 = slots.find(
										(s) => s.round === slot.round - 1 && s.position === slot.position * 2
									)}
									<p
										class={slot.name.length > 16 ? 'text-sm xl:text-lg' : 'text-lg'}
										data-testid={`SlotNameR${slot.round}P${slot.position}`}
									>
										{`${slot.seed} ${slot.name}`}
									</p>
									<MatchScore {slot} {prevSlot1} {prevSlot2} draw={data.draw} />
								{:else}
									<p
										class="text-lg italic text-surface-800"
										data-testid={`SlotNameR${slot.round}P${slot.position}`}
									>
										TBD
									</p>
								{/if}
								{#if index > 0}
									{@const slotRenderData = getSlotRenderData(slot)}
									{@const players = getPlayerOptions(slot, index)}
									{#if !predictionsLoading}
										<div
											class="absolute bottom-0 z-10 flex h-20 w-full translate-y-full flex-wrap content-start justify-center gap-2 p-1.5"
											in:fade={{ duration: 100 }}
										>
											{#if slotRenderData}
												{#if $isAuth}
													<AddPrediction
														{slot}
														roundIndex={index}
														{players}
														prediction={slotRenderData?.currentUserPrediction}
														{predictionsAllowed}
													/>
												{/if}
												{#each slotRenderData?.selectedUserPredictions ?? [] as prediction}
													<ViewPrediction {prediction} />
												{/each}
											{:else}
												<p class="text-sm italic">No slot data found</p>
											{/if}
										</div>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</main>
