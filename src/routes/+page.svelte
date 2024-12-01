<script lang="ts">
	import { isAuth, currentUsername, loginGoto } from '$lib/store'
	import { getSlug, getTitle } from '$lib/utils'
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import { onMount } from 'svelte'
	import { type HomePageData, TournamentName } from '$lib/types'
	import { format } from 'date-fns'
	import Header from '$lib/components/Header.svelte'
	import arrow from '$lib/images/icons/arrow-down-solid.svg'

	interface Props {
		data: HomePageData
	}

	let { data }: Props = $props()

	const bannerStyleMap: { [key in TournamentName]: string } = {
		[TournamentName.AUSTRALIAN_OPEN]: 'bg-gradient-to-r from-indigo-800 via-blue-500 to-cyan-300',
		[TournamentName.FRENCH_OPEN]: 'bg-gradient-to-r from-red-700 via-orange-500 to-amber-300',
		[TournamentName.WIMBLEDON]: 'bg-gradient-to-r from-green-600 via-blue-400 to-purple-600',
		[TournamentName.US_OPEN]: 'bg-gradient-to-r from-blue-700 via-orange-500 to-yellow-300'
	}

	const formatDateRange = (start: string, end: string) => {
		const startDate = new Date(start)
		const endDate = new Date(end)
		return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
	}

	const dateRange = formatDateRange(data.banner.start_date, data.banner.end_date)

	onMount(() => {
		loginGoto.set('/')
	})
</script>

<Header twClass="absolute z-10" color="transparent" />
<main class="w-full bg-stone-100 pb-8 sm:pb-16">
	<section class="relative h-screen w-full overflow-hidden">
		<img
			src="/src/lib/images/wimbledon.jpg"
			alt="Wimbledon"
			class="absolute inset-0 h-full w-full object-cover object-bottom"
		/>
		<div class="absolute inset-0 bg-gradient-to-b from-primary-500/40 to-stone-900"></div>
		<div class="absolute flex h-full w-full items-center justify-center">
			<img src={bracketLeft} alt="left bracket" class="block h-24 invert sm:h-32 md:h-48" />
			<h1
				class="w-fit text-center text-5xl font-bold tracking-tight text-white md:text-8xl lg:text-9xl"
			>
				Racquet Rivals
			</h1>
			<img
				src={bracketLeft}
				alt="right bracket"
				class="block h-24 rotate-180 invert sm:h-32 md:h-48"
			/>
		</div>
		<img src={arrow} alt="arrow" class="absolute bottom-4 left-1/2 w-6 -translate-x-1/2 invert" />
		<div class="absolute bottom-16 left-1/2 w-full -translate-x-1/2 px-4">
			{#if $isAuth}
				<p class="mb-8 text-center text-3xl font-semibold text-white sm:text-4xl">
					Welcome {$currentUsername}!
				</p>
			{:else}
				<p class="mb-8 text-center text-xl font-semibold text-white sm:text-3xl">
					Predict outcomes of tennis matches, and compete with fellow fans!
				</p>
				<div class="mx-auto flex max-w-screen-sm gap-4">
					<a
						href="/login"
						class="block w-1/2 rounded border-2 border-white p-4 text-center text-2xl font-semibold text-white shadow duration-100 hover:scale-105"
					>
						<button type="button">Login</button>
					</a>
					<a
						href="/create-account"
						class="block w-1/2 rounded border-2 border-white p-4 text-center text-2xl font-semibold text-white shadow duration-100 hover:scale-105"
					>
						<button type="button">Sign up</button>
					</a>
				</div>
			{/if}
		</div>
	</section>
	<section
		class="mx-auto mb-8 flex flex-col gap-8 py-24 text-center font-bold text-white sm:mb-16 {bannerStyleMap[
			data.banner.next_tournament
		]}"
	>
		<p class="text-4xl sm:text-7xl">{data.banner.next_tournament}</p>
		<p class="text-2xl sm:text-4xl">{dateRange}</p>
	</section>
	<section class="mx-auto max-w-screen-sm px-4 sm:px-0">
		<div class="mb-8 flex flex-col overflow-hidden rounded-xl shadow sm:mb-16">
			<h3 class="bg-primary-700 px-4 py-2 text-2xl font-bold text-white sm:py-4 sm:text-4xl">
				Active Draws
			</h3>
			{#if data.active.totalItems > 0}
				{#each data.active.items as draw, index}
					<a
						href={`/draw/${getSlug(draw)}`}
						class={`w-full ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'} p-2 sm:p-4 sm:text-3xl md:hover:brightness-105`}
					>
						<button type="button">
							{getTitle(draw)}
						</button>
					</a>
				{/each}
			{:else}
				<p class="bg-primary-50 p-4 text-center text-3xl">No active draws</p>
			{/if}
		</div>
		<div class="flex flex-col overflow-hidden rounded-xl shadow">
			<h3 class="bg-primary-700 px-4 py-2 text-2xl font-bold text-white sm:py-4 sm:text-4xl">
				Completed Draws
			</h3>
			{#each data.completed.items as draw, index}
				<a
					href={`/draw/${getSlug(draw)}`}
					class={`w-full ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'} p-2 sm:p-4 sm:text-3xl md:hover:brightness-105`}
				>
					<button type="button">
						{getTitle(draw)}
					</button>
				</a>
			{/each}
		</div>
	</section>
</main>
