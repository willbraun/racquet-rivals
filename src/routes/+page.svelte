<script lang="ts">
	import Pocketbase from 'pocketbase'
	import Logout from '$lib/Logout.svelte'
	import { afterNavigate } from '$app/navigation'
	import { isAuth, currentUsername, isMobile } from '$lib/store'
	import { getSlug, getTitle, updatePageAuth } from '$lib/utils'
	import bracketLeft from '$lib/images/bracket-left.svg'
	import { onMount } from 'svelte'
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	import HowToPlay from '$lib/HowToPlay.svelte'
	import type { HomePageData, TournamentName } from '$lib/types'
	import { format } from 'date-fns'
	import ShareLink from '$lib/ShareLink.svelte'
	export let data: HomePageData

	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

	isAuth.set(data.pb_auth_valid)
	currentUsername.set(data.pb_auth_username)
	afterNavigate(() => updatePageAuth(pb, data.pb_auth_valid, data.pb_auth_cookie))

	const pillStyle =
		'flex justify-center items-center text-center text-lg sm:text-xl md:text-2xl rounded-full px-4 py-2'

	const bannerStyleMap: { [key in TournamentName]: string } = {
		'Australian Open': 'bg-gradient-to-r from-indigo-600 to-cyan-300',
		'French Open': 'bg-gradient-to-r from-orange-600 to-orange-300',
		Wimbledon: 'bg-gradient-to-r from-green-600 to-purple-600',
		'US Open': 'bg-gradient-to-r from-blue-700 to-yellow-300'
	}

	const formatDateRange = (start: string, end: string) => {
		const startDate = new Date(start)
		const endDate = new Date(end)
		return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
	}

	const dateRange = formatDateRange(data.banner.start_date, data.banner.end_date)

	onMount(() => {
		sessionStorage.setItem('loginGoto', '/')
	})
</script>

<header class="absolute right-0 top-0 flex items-center justify-end gap-2 p-4">
	<ShareLink />
	<HowToPlay />
	{#if $isAuth}
		<Logout />
	{/if}
</header>
<main class="h-max w-full bg-stone-100 px-2 py-4 sm:px-4">
	<div class="mx-auto h-full max-w-5xl">
		<section class="mb-16">
			<div class="my-16 grid grid-cols-4 items-center">
				<img src={bracketLeft} alt="left bracket" />
				<h1
					class="col-span-2 whitespace-pre-line text-center text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl lg:text-9xl"
				>
					{'Racquet\nRivals'}
				</h1>
				<img src={bracketLeft} alt="right bracket" class="rotate-180" />
			</div>
			{#if $isAuth}
				<div class="{pillStyle} col-start-1 col-end-2 mx-auto w-fit bg-blue-300 shadow-lg">
					Welcome {$currentUsername}!
				</div>
			{:else}
				<div class="grid grid-cols-2 grid-rows-4 gap-4">
					<div class="{pillStyle} col-start-1 col-end-3 bg-blue-300 shadow-xl sm:col-end-2">
						Create brackets for the last 16 players of pro tennis tournaments
					</div>
					<div
						class="{pillStyle} col-start-1 col-end-3 row-start-2 bg-orange-300 shadow-xl sm:col-start-2"
					>
						Earn points if your players win, and see how you stack up with your friends
					</div>
					<a
						href="/login"
						class="block {pillStyle} col-start-1 col-end-3 row-start-3 bg-yellow-200 font-semibold shadow-xl duration-100 hover:scale-105 sm:col-end-2"
					>
						<button type="button">Login</button>
					</a>
					<a
						href="/create-account"
						class="block {pillStyle} col-start-1 col-end-3 row-start-4 bg-purple-300 font-semibold shadow-xl duration-100 hover:scale-105 sm:col-start-2"
					>
						<button type="button">Sign up</button>
					</a>
				</div>
			{/if}
		</section>
		<section class="mb-24">
			<div
				class="mx-4 mb-12 flex flex-col gap-8 rounded-xl p-4 text-center text-2xl font-bold text-white shadow-lg sm:text-4xl {bannerStyleMap[
					data.banner.next_tournament
				]}"
			>
				<p>{data.banner.next_tournament}</p>
				<p>{dateRange}</p>
			</div>
			<h3 class="mb-8 text-center text-4xl sm:text-6xl">Active Draws</h3>
			{#if data.active.totalItems > 0}
				{#each data.active.items as draw}
					<a
						href={`/draw/${getSlug(draw)}`}
						class="{pillStyle} mx-auto mb-4 w-fit bg-green-300 shadow-lg duration-100 hover:scale-105"
					>
						<button type="button">
							{getTitle(draw)}
						</button>
					</a>
				{/each}
			{:else}
				<p class="mb-16 text-center text-xl">No active draws</p>
			{/if}
			<h3 class="mb-8 mt-16 text-center text-4xl sm:text-6xl">Completed Draws</h3>
			{#if data.completed.totalItems > 0}
				{#each data.completed.items as draw}
					<a
						href={`/draw/${getSlug(draw)}`}
						class="{pillStyle} mx-auto mb-4 w-fit bg-slate-300 shadow-lg duration-100 hover:scale-105"
					>
						<button type="button">
							{getTitle(draw)}
						</button>
					</a>
				{/each}
			{:else}
				<p class="text-center text-xl">No completed draws</p>
			{/if}
		</section>
	</div>
</main>
