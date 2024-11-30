<script lang="ts">
	import { isAuth, currentUsername, drawNavUrl } from '$lib/store'
	import { getSlug, getTitle } from '$lib/utils'
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import { onMount } from 'svelte'
	import { type HomePageData, TournamentName } from '$lib/types'
	import { format } from 'date-fns'
	import Header from '$lib/components/Header.svelte'

	interface Props {
		data: HomePageData
	}

	let { data }: Props = $props()

	const pillStyle =
		'flex justify-center items-center text-center text-lg sm:text-xl md:text-2xl px-4 py-2'

	const clickablePillStyle = `${pillStyle} cursor-pointer md:hover:brightness-105`

	const bannerStyleMap: { [key in TournamentName]: string } = {
		[TournamentName.AUSTRALIAN_OPEN]: 'bg-gradient-to-r from-indigo-600 to-cyan-300',
		[TournamentName.FRENCH_OPEN]: 'bg-gradient-to-r from-orange-600 to-orange-300',
		[TournamentName.WIMBLEDON]: 'bg-gradient-to-r from-green-600 to-purple-600',
		[TournamentName.US_OPEN]: 'bg-gradient-to-r from-blue-700 to-yellow-300'
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

<Header twClass="absolute z-10" color="transparent" />
<main class="w-full bg-stone-100 pb-8 sm:pb-16">
	<section class="relative h-screen w-full overflow-hidden">
		<img
			src="/src/lib/images/wimbledon.jpg"
			alt="Wimbledon"
			class="absolute inset-0 h-full w-full object-cover object-bottom"
		/>
		<div class="absolute inset-0 flex items-center justify-center bg-primary-500 bg-opacity-50">
			<img src={bracketLeft} alt="left bracket" class="block h-24 invert sm:h-48 md:h-64" />
			<h1 class="text-center text-5xl font-bold tracking-tight text-white md:text-8xl lg:text-9xl">
				Racquet Rivals
			</h1>
			<img
				src={bracketLeft}
				alt="right bracket"
				class="block h-24 rotate-180 invert sm:h-48 md:h-64"
			/>
		</div>
	</section>
	<section class="my-8 px-4 sm:my-16">
		<p class="mb-8 text-center text-2xl sm:mb-16 sm:text-4xl">
			Predict outcomes of tennis matches, and compete with fellow fans!
		</p>
		<div class="mx-auto mb-8 flex max-w-screen-sm gap-4">
			<a
				href="/login"
				class="block w-1/2 rounded bg-primary-300 p-4 text-center text-2xl font-semibold shadow duration-100 hover:scale-105 sm:col-end-2"
			>
				<button type="button">Login</button>
			</a>
			<a
				href="/create-account"
				class="block w-1/2 rounded bg-primary-300 p-4 text-center text-2xl font-semibold shadow duration-100 hover:scale-105 sm:col-start-2"
			>
				<button type="button">Sign up</button>
			</a>
		</div>
	</section>
	<div
		class="mx-auto mb-8 flex flex-col gap-8 p-16 text-center font-bold text-white sm:mb-16 {bannerStyleMap[
			data.banner.next_tournament
		]}"
	>
		<p class="text-4xl sm:text-7xl">{data.banner.next_tournament}</p>
		<p class="text-2xl sm:text-4xl">{dateRange}</p>
	</div>
	<section class="mx-auto max-w-screen-sm px-4 sm:px-0">
		<div class="mb-8 flex flex-col overflow-hidden rounded-xl shadow sm:mb-16">
			<h3 class="bg-primary-700 px-4 py-2 text-2xl font-bold text-white sm:py-4 sm:text-4xl">
				Active Draws
			</h3>
			{#if data.active.totalItems > 0}
				{#each data.active.items as draw, index}
					<a
						href={`/draw/${getSlug(draw)}`}
						class={`w-full ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'} p-2 sm:p-4 sm:text-3xl`}
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
					class={`w-full ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'} p-2 sm:p-4 sm:text-3xl`}
				>
					<button type="button">
						{getTitle(draw)}
					</button>
				</a>
			{/each}
		</div>
	</section>
</main>
