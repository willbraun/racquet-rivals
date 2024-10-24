<script lang="ts">
	import { format } from 'date-fns'
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton'
	import { DrawStatus, type ProfilePageData } from '$lib/types'
	import trophy from '$lib/images/icons/trophy-solid.svg'
	import Rank from '$lib/components/Rank.svelte'
	import { getDrawStatus, getSlug, getTitle, formatAvg, formatPercent } from '$lib/utils'
	import InfoIcon from './InfoIcon.svelte'
	import Header from '$lib/components/Header.svelte'
	export let data: ProfilePageData

	const formatRank = (num: number | null): string => {
		if (num === null) {
			return 'N/A'
		}

		return `#${num}`
	}
</script>

<Header />
<main class="bg-stone-100">
	<div class="mx-auto max-w-screen-lg px-4">
		<section class="mb-8">
			<h1 class="mb-4 text-4xl font-bold md:text-7xl">{data.username}</h1>
			<p class="sm:text-2xl">Joined {format(new Date(data.created), 'MMM dd, yyyy')}</p>
		</section>
		<section class="mb-4 rounded-xl bg-stone-250 shadow md:mb-8 md:p-8">
			<Accordion hover="none">
				<AccordionItem>
					<div slot="summary" class="grid grid-cols-2 items-center gap-4">
						<a href="/rankings">
							<h2 class="flex flex-wrap items-center font-bold md:text-3xl md:hover:underline">
								<span
									>Overall Rank <img
										src={trophy}
										alt="trophy"
										class="inline w-4 md:ml-2 md:w-8"
									/></span
								>
							</h2>
						</a>
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
		<section class="mb-4 rounded-xl bg-stone-250 shadow md:mb-8 md:p-8">
			<Accordion hover="none">
				<AccordionItem>
					<div slot="summary" class="grid grid-cols-4 items-center gap-4">
						<a href="/rankings/average-points" class="col-span-2">
							<h2 class="flex flex-wrap items-center font-bold md:text-3xl md:hover:underline">
								<span
									>Average Points
									<img src={trophy} alt="trophy" class="inline w-4 md:ml-2 md:w-8" />
								</span>
							</h2>
						</a>
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
		<section class="mb-4 rounded-xl bg-stone-250 shadow md:mb-8 md:p-8">
			<Accordion hover="none">
				<AccordionItem>
					<div slot="summary" class=" grid grid-cols-4 items-center items-center gap-4">
						<a href="/rankings/prediction-accuracy" class="col-span-2">
							<h2 class="flex flex-wrap items-center font-bold md:text-3xl md:hover:underline">
								<span
									>Prediction Accuracy <img
										src={trophy}
										alt="trophy"
										class="inline w-4 md:ml-2 md:w-8"
									/></span
								>
							</h2>
						</a>
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
		<section class="py-16">
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
