<script lang="ts">
	import { run } from 'svelte/legacy';

	import Pocketbase from 'pocketbase'
	import AddPrediction from './AddPrediction.svelte'
	import ViewPrediction from './ViewPrediction.svelte'
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'
	import { onMount } from 'svelte'
	import { isAuth, selectedUsers, isLeaderboard, predictionStore, drawNavUrl } from '$lib/store'
	import { type DrawPageData, type Prediction, type SelectedUser, type Slot } from '$lib/types'
	import { goto } from '$app/navigation'
	import { format } from 'date-fns'
	import { addUser, getSlug, getTitle, removeUser, updatePageAuth } from '$lib/utils'
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	import { getPredictions } from '$lib/api'
	import { browser } from '$app/environment'
	import Cookies from 'js-cookie'
	import plus from '$lib/images/icons/plus.svg'
	import edit from '$lib/images/icons/pen-to-square.svg'
	import x from '$lib/images/icons/x.svg'
	import Rank from '$lib/components/Rank.svelte'
	import Header from '$lib/components/Header.svelte'
	interface Props {
		data: DrawPageData;
	}

	let { data }: Props = $props();

	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)
	const now = new Date()

	drawNavUrl.set(`/draw/${getSlug(data.draw)}`)

	let isScrollListenerAdded: boolean = $state(false)
	let roundHeader: HTMLElement = $state()
	let drawGrid: HTMLElement = $state()

	const syncScroll = () => {
		roundHeader.scrollLeft = drawGrid.scrollLeft
	}


	let serverIsLeaderboard = data.isLeaderboard === 'true'
	isLeaderboard.set(serverIsLeaderboard)
	let combinedIsLeaderboard = $state(serverIsLeaderboard)
	const toggleLeaderboard = (value: boolean) => {
		isLeaderboard.set(value)
		Cookies.set('isLeaderboard', value.toString(), { expires: 0.5 })
		if (value === true) {
			isScrollListenerAdded = false
		}
	}

	let combinedSelectedUsers = $state(data.cookieSelectedUsers)

	let combinedPredictions = $state(data.predictions.items)
	const updatePredictions = async (allUsers: SelectedUser[]) => {
		const predictionData = await getPredictions(data.draw.id, allUsers, pb.authStore.token)
		predictionStore.set(predictionData.items)
		combinedPredictions = $predictionStore
	}


	const headerColor = 'bg-primary-50'
	const pointsByRound = {
		'Round of 16': 0,
		Quarterfinals: 1,
		Semifinals: 2,
		Final: 4,
		Champion: 8
	}
 // rounds start at 1

	let pcDate: Date | undefined = $state()
	let predictionClose: string = $state()
	let predictionsAllowed: boolean = $state()


	const colorMap: Map<string, string> = new Map()
	const getColor = (userId: string | undefined) => colorMap.get(userId ?? '') ?? 'bg-white'

	let drawUrl = $state('')

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
	let modal: ModalSettings = $state()

	onMount(() => {
		sessionStorage.setItem('loginGoto', location.pathname)
	})
	run(() => {
		combinedIsLeaderboard = $isAuth && $isLeaderboard
	});
	run(() => {
		if (!combinedIsLeaderboard && !isScrollListenerAdded && roundHeader && drawGrid) {
			drawGrid.addEventListener('scroll', syncScroll)
			isScrollListenerAdded = true
		}
	});
	run(() => {
		if (browser) {
			combinedSelectedUsers = $selectedUsers
		}
	});
	let users = $derived([
		data.currentUser,
		...combinedSelectedUsers.filter((user) => user.selectorId === data.currentUser.id)
	])
	run(() => {
		if (browser) {
			updatePredictions(users)
		}
	});
	let userIds = $derived(users.map((user) => user.id))
	let fullDrawRounds = $derived(Math.log2(data.draw.size) + 1)
	let allRounds = $derived([...Array(fullDrawRounds).keys()].map((x) => x + 1))
	let ourRounds = $derived(allRounds.slice(-5))
	let slots = $derived(data.slots.items.filter((slot) => slot.round >= fullDrawRounds - 4))
	run(() => {
		if (data.draw.prediction_close) {
			pcDate = new Date(data.draw.prediction_close)
			predictionClose = format(pcDate, 'M/d/yyyy h:mmaaa')
			predictionsAllowed = now < pcDate
		} else {
			pcDate = undefined
			predictionClose = '12h after R16 is full'
			predictionsAllowed = true
		}
	});
	let roundLabel = $derived((() => {
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
	})())
	run(() => {
		users.forEach((user) => colorMap.set(user.id, user.color))
	});
	run(() => {
		if (drawUrl) {
			goto(drawUrl, { invalidateAll: true })
			sessionStorage.setItem('loginGoto', drawUrl)
			drawNavUrl.set(drawUrl)
		}
	});
	run(() => {
		if (isAuth) {
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
	});
</script>

<Header color="bg-primary-50">
	<select
		class="select flex-grow cursor-pointer whitespace-pre-wrap border-none bg-transparent px-1 py-0 text-lg font-bold hover:bg-primary-200 md:text-2xl"
		onchange={(e) => (drawUrl = e.currentTarget.value)}
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
<section class="grid grid-cols-4 gap-2 px-4 pb-4 {headerColor} [&>*]:text-lg">
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
					<button
						type="button"
						class="chip relative h-6 rounded-full text-black {user.color} shadow"
						onclick={() => goto(`/profile/${user.username}`)}
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
					</button>
				{/each}
				<button
					class="chip flex h-6 justify-center rounded-full border border-dashed border-black hover:bg-primary-100"
					onclick={() => modalStore.trigger(modal)}
				>
					<img src={edit} alt="edit icon" width="16" class="mb-0.5 ml-0.5" />
				</button>
			</div>
			<div class="flex min-w-fit overflow-hidden rounded-md" data-testid="LeaderboardToggle">
				<button
					class={`px-3 py-1 text-sm ${combinedIsLeaderboard ? 'bg-primary-300 md:hover:brightness-105' : 'bg-primary-500 text-white'}`}
					onclick={() => toggleLeaderboard(false)}>Draw</button
				>
				<button
					class={`px-3 py-1 text-sm ${combinedIsLeaderboard ? 'bg-primary-500 text-white' : 'bg-primary-300 md:hover:brightness-105'}`}
					onclick={() => toggleLeaderboard(true)}>Leaderboard</button
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
						<button
							type="button"
							class={`chip rounded-full text-lg ${selectedUser ? `shadow ${selectedUser.color}` : 'hover:underline'}`}
							onclick={() => goto(`/profile/${result.username}`)}
						>
							{result.username}
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
						{:else if combinedSelectedUsers.find((u) => u.id === result.user_id)}
							<button
								onclick={() => removeUser(result.user_id)}
								class="mx-auto flex h-6 items-center justify-center gap-2 rounded-lg bg-red-200 px-2 py-1 sm:h-fit"
							>
								<p class="hidden sm:block">Remove</p>
								<img src={x} alt="plus icon" width="12" />
							</button>
						{:else}
							{@const newUser = {
								selectorId: data.currentUser.id,
								id: result.user_id,
								username: result.username
							}}
							<button
								onclick={() => addUser(newUser)}
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
