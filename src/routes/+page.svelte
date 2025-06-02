<script lang="ts">
	import { fadeAndSlideIn } from '$lib/actions/fadeAndSlideIn'
	import Header from '$lib/components/Header.svelte'
	import { bannerStyleMap } from '$lib/data'
	import arrow from '$lib/images/icons/arrow-down-solid.svg'
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import wimbledon from '$lib/images/wimbledon.jpg'
	import { currentUser, isAuth, loginGoto } from '$lib/store'
	import { type Draw, type HomePageData } from '$lib/types'
	import { capitalize, getSlug, getTitle } from '$lib/utils'
	import { format } from 'date-fns'
	import { onMount } from 'svelte'

	interface Props {
		data: HomePageData
	}

	let { data }: Props = $props()

	const formatDateRange = (start: string, end: string) => {
		const startDate = new Date(start)
		const endDate = new Date(end)
		return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
	}

	let bannerDraw = $derived.by(() => {
		if (data.active.length > 0) {
			return data.active[0]
		} else if (data.upcoming.length > 0) {
			return data.upcoming[0]
		} else if (data.completed.length > 0) {
			return data.completed[0]
		}
		return null
	})

	const dateRange = $derived.by(() => {
		if (!bannerDraw) return ''
		return formatDateRange(bannerDraw.start_date, bannerDraw.end_date)
	})

	onMount(() => {
		loginGoto.set('/')
	})
</script>

<svelte:head>
	<title>Racquet Rivals</title>
	<meta
		name="description"
		content="Your fantasy tennis community. Predict match winners and compete with fellow fans!"
	/>
</svelte:head>

{#snippet drawList(listTitle: string, draws: Draw[])}
	{#if draws.length > 0}
		<div class="mb-8 flex flex-col overflow-hidden rounded-xl shadow sm:mb-16" use:fadeAndSlideIn>
			<p class="bg-primary-700 px-4 py-2 text-2xl font-bold text-white sm:py-4 sm:text-4xl">
				{`${capitalize(listTitle)} Draws`}
			</p>
			{#each draws as draw, index}
				<a
					href={`/draw/${getSlug(draw)}`}
					class={`w-full ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'} p-2 hover:brightness-105 sm:p-4 sm:text-3xl`}
				>
					{getTitle(draw)}
				</a>
			{/each}
		</div>
	{/if}
{/snippet}

<Header twClass="absolute z-10" color="transparent" />
<main class="w-full bg-stone-100 pb-8">
	<section class="relative h-svh w-full overflow-hidden">
		<!-- Photo credit to Shep McAllister on Unsplash - https://unsplash.com/photos/two-person-playing-tennis-J1j3cImjmgE -->
		<img src={wimbledon} alt="Wimbledon" class="absolute inset-0 h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-b from-primary-500/40 to-black"></div>
		<div class="absolute flex h-3/4 w-full items-center justify-center">
			<img src={bracketLeft} alt="left bracket" class="block h-24 invert sm:h-32 md:h-48 lg:h-64" />
			<h1 class="w-1/2 text-center font-PoetsenOne text-5xl text-white md:text-7xl lg:text-9xl">
				Racquet<br />Rivals
			</h1>
			<img
				src={bracketLeft}
				alt="right bracket"
				class="block h-24 rotate-180 invert sm:h-32 md:h-48 lg:h-64"
			/>
		</div>
		<div class="absolute bottom-16 left-1/2 w-full -translate-x-1/2 px-4">
			{#if $isAuth}
				<p class="mb-8 text-center text-3xl font-semibold text-white sm:text-4xl">
					Welcome {$currentUser?.username}!
				</p>
			{:else}
				<div class="flex flex-col items-center gap-4 pt-8 lg:gap-8">
					<div class="text-center text-xl font-semibold text-white sm:text-3xl">
						<p>Your fantasy tennis community.</p>
						<p>Predict match winners and compete with fellow fans!</p>
					</div>
					<div class="flex w-full max-w-screen-sm justify-center gap-4">
						<a
							href="/login"
							class="w-1/2 rounded-xl border-2 border-white p-4 text-center text-2xl font-semibold text-white shadow duration-100 hover:scale-105"
						>
							Log in
						</a>
						<a
							href="/create-account"
							class="w-1/2 rounded-xl border-2 border-white p-4 text-center text-2xl font-semibold text-white shadow duration-100 hover:scale-105"
						>
							Sign up
						</a>
					</div>
					<a href="/about" class="text-center text-white underline">How it works</a>
				</div>
			{/if}
		</div>
		<div class="absolute bottom-4 left-1/2 w-6 -translate-x-1/2">
			<img
				src={arrow}
				alt="arrow"
				aria-label="Scroll down to see more content"
				class="animate-bounce invert"
			/>
		</div>
	</section>
	{#if bannerDraw}
		<a href={`/draw/${getSlug(bannerDraw)}`}>
			<section
				class="mx-auto mb-8 flex flex-col gap-8 py-24 text-center font-bold text-white sm:mb-16 {bannerStyleMap[
					bannerDraw.name
				]}"
				data-testid="banner-draw"
			>
				<p class="text-4xl sm:text-7xl" use:fadeAndSlideIn>{bannerDraw.name}</p>
				<p class="text-2xl sm:text-4xl" use:fadeAndSlideIn>{dateRange}</p>
			</section>
		</a>
	{/if}
	<section class="mx-auto max-w-screen-sm px-4 sm:px-0">
		{#if data.active.length > 0}
			{@render drawList('Active', data.active)}
		{:else if data.upcoming.length > 0}
			{@render drawList('Upcoming', data.upcoming)}
		{/if}
		{@render drawList('Completed', data.completed)}
	</section>
</main>
