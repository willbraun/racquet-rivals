<script lang="ts">
	import { format } from 'date-fns'
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton'
	import { DrawStatus, type ProfilePageData } from '$lib/types'
	import arrowLeft from '$lib/images/icons/arrow-left-solid.svg'
	import home from '$lib/images/icons/home.svg'
	import NavMenu from '$lib/components/NavMenu.svelte'
	import HowToPlay from '$lib/components/HowToPlay.svelte'
	import Rank from '$lib/components/Rank.svelte'
	import { getDrawStatus, getSlug, getTitle } from '$lib/utils'
	import InfoIcon from './InfoIcon.svelte'
	export let data: ProfilePageData

	const goBack = () => {
		if (window.history.length > 1) {
			window.history.back()
		} else {
			window.location.href = '/'
		}
	}

	const formatRank = (num: number | null): string => {
		if (num === null) {
			return 'N/A'
		}

		return `#${num}`
	}

	const formatAvg = (num: number | null): string => {
		if (num === null) {
			return 'N/A'
		}

		let result: string
		const rounded = Math.round(num * 100) / 100
		if (Number.isInteger(rounded)) {
			result = rounded.toString()
		} else if (Number.isInteger(rounded * 10)) {
			result = rounded.toFixed(1)
		} else {
			result = rounded.toFixed(2)
		}

		return result
	}

	const formatPercent = (num: number | null): string => {
		if (num === null) {
			return 'N/A'
		}

		let result: string
		if (Number.isInteger(num)) {
			result = num.toString()
		} else {
			const rounded = Math.round(num * 100) / 100
			if (Number.isInteger(rounded)) {
				result = rounded.toString()
			} else {
				result = rounded.toFixed(1)
			}
		}

		return `${result}%`
	}
</script>

<header class="flex items-center gap-4 px-4 py-[18px]">
	<a class="flex items-center justify-center px-2" href="/">
		<img src={home} alt="home" />
	</a>
	<a href="/" on:click|preventDefault={goBack} class="mr-auto">
		<img src={arrowLeft} alt="back" width="24" />
	</a>
	<HowToPlay />
	<NavMenu />
</header>
<main>
	<div class="mx-auto max-w-screen-lg px-4">
		<section class="mb-8">
			<h1 class="mb-4 text-4xl font-bold md:text-7xl">{data.username}</h1>
			<p class="sm:text-2xl">Joined {format(new Date(data.created), 'MMM dd, yyyy')}</p>
		</section>
		<section class="mb-4 rounded-xl bg-stone-200 shadow md:mb-8 md:p-8">
			<Accordion hover="none">
				<AccordionItem>
					<div slot="summary" class="grid grid-cols-2 items-center gap-4">
						<h2 class="text-lg font-bold md:text-3xl">Overall Rank</h2>
						<p class="self-end md:text-2xl">Ranking Points</p>
						<p class="text-2xl font-semibold md:text-7xl">{formatRank(data.overallRank.rank)}</p>
						<p class="self-end text-2xl md:text-6xl">{data.overallRank.total_points}</p>
					</div>
					<svelte:fragment slot="content"
						>Based on the last year of play (8 major tournaments, men's and women's singles). This
						is how professional player rankings work. Points earned in a tournament apply to your
						ranking for one year.
					</svelte:fragment>
					<svelte:fragment slot="iconOpen"><InfoIcon /></svelte:fragment>
					<svelte:fragment slot="iconClosed"><InfoIcon /></svelte:fragment>
				</AccordionItem>
			</Accordion>
		</section>
		<section class="mb-4 rounded-xl bg-stone-200 shadow md:mb-8 md:p-8">
			<Accordion hover="none">
				<AccordionItem>
					<div slot="summary" class="grid grid-cols-4 items-center items-center gap-4 gap-4">
						<h2 class="col-span-2 text-lg font-bold md:text-3xl">Average Points</h2>
						<p class="self-end md:text-2xl">Rank</p>
						<p class="self-end md:text-2xl">Percentile</p>
						<p class="col-span-2 text-2xl font-semibold md:text-7xl">
							{formatAvg(data.averagePoints.avg_points_per_draw)}
						</p>
						<p class="self-end text-2xl md:text-6xl">{formatRank(data.averagePoints.rank)}</p>
						<p class="self-end text-2xl md:text-6xl">
							{formatPercent(data.averagePoints.percentile)}
						</p>
					</div>
					<svelte:fragment slot="content"
						>Your average score across all tournaments you've played.
					</svelte:fragment>
					<svelte:fragment slot="iconOpen"><InfoIcon /></svelte:fragment>
					<svelte:fragment slot="iconClosed"><InfoIcon /></svelte:fragment>
				</AccordionItem>
			</Accordion>
		</section>
		<section class="mb-4 rounded-xl bg-stone-200 shadow md:mb-8 md:p-8">
			<Accordion hover="none">
				<AccordionItem>
					<div slot="summary" class=" grid grid-cols-4 items-center items-center gap-4 gap-4">
						<h2 class="col-span-2 text-lg font-bold md:text-3xl">Prediction Accuracy</h2>
						<p class="self-end md:text-2xl">Rank</p>
						<p class="self-end md:text-2xl">Percentile</p>
						<p class="col-span-2 text-2xl font-semibold md:text-7xl">
							{formatPercent(data.predictionAccuracy.percent_correct)}
						</p>
						<p class="self-end text-2xl md:text-6xl">{formatRank(data.predictionAccuracy.rank)}</p>
						<p class="self-end text-2xl md:text-6xl">
							{formatPercent(data.predictionAccuracy.percentile)}
						</p>
						<p class="text-xs text-gray-500 md:text-base">
							{`(${data.predictionAccuracy.correct}/${data.predictionAccuracy.total})`}
						</p>
					</div>
					<svelte:fragment slot="content"
						>How often you choose correctly across all tournaments you've played.</svelte:fragment
					>
					<svelte:fragment slot="iconOpen"><InfoIcon /></svelte:fragment>
					<svelte:fragment slot="iconClosed"><InfoIcon /></svelte:fragment>
				</AccordionItem>
			</Accordion>
		</section>
		<section class="my-16">
			<div class="mb-4 grid grid-cols-8">
				<h2 class="col-span-6 text-lg font-bold md:text-3xl">Results</h2>
				<p class="mx-auto self-end text-sm md:text-2xl">Points</p>
				<p class="mx-auto self-end text-sm md:text-2xl">Rank</p>
			</div>
			{#if data.drawResults.items.length === 0}
				<p class="text-center md:text-2xl">No results yet</p>
			{:else}
				<ul class="flex flex-col overflow-hidden rounded shadow md:rounded-2xl">
					{#each data.drawResults.items as drawResult, index}
						{@const status = getDrawStatus(drawResult.draw_start_date, drawResult.draw_end_date)}
						{@const showCutoff = index === 7 && data.drawResults.items.length > 8}
						<a href={`/draw/${getSlug(drawResult)}`} class="relative">
							<li
								class={`grid w-full grid-cols-8 items-center gap-4 p-2 md:p-4 md:hover:brightness-105 ${
									index % 2 ? 'bg-primary-50' : 'bg-primary-200'
								} ${status === DrawStatus.ACTIVE && 'animate-pulse-green'} ${showCutoff ? 'border-b-2 border-pure-red' : ''}`}
							>
								<p class="col-span-6 flex md:text-4xl">
									{getTitle(drawResult)}
								</p>
								{#if drawResult.prediction_count > 0 || status === DrawStatus.ACTIVE}
									<div
										class={`badge-icon mx-auto w-fit rounded-full bg-green-400 px-2 text-lg md:h-10 md:min-w-10 md:text-3xl`}
									>
										{drawResult.total_points}
									</div>
									<Rank
										rank={drawResult.rank}
										containerStyle="mx-auto w-6 md:w-10"
										textStyle="text-lg md:text-3xl font-extrabold"
									/>
								{:else}
									<div
										class="col-span-2 mx-auto w-5/6 rounded bg-primary-600 px-2 text-center text-xs font-bold text-white md:text-2xl"
									>
										<p class="hidden sm:block">DID NOT PLAY</p>
										<p class="block sm:hidden">DNP</p>
									</div>
								{/if}
							</li>
							{#if showCutoff}
								<div
									class="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-pure-red px-2 text-xs font-bold text-white"
								>
									OVERALL RANK CUTOFF
								</div>
							{/if}
						</a>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</main>
