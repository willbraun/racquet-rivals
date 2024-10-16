<script lang="ts">
	import type { ProfilePageData } from '$lib/types'
	import NavMenu from '$lib/NavMenu.svelte'
	import { format } from 'date-fns'
	import HowToPlay from '$lib/HowToPlay.svelte'
	import { getSlug, getTitle } from '$lib/utils'
	import Rank from '$lib/Rank.svelte'

	export let data: ProfilePageData

	const formatAvg = (num: number) => {
		const rounded = Math.round(num * 100) / 100
		if (Number.isInteger(rounded)) {
			return rounded
		} else if (Number.isInteger(rounded * 10)) {
			return rounded.toFixed(1)
		} else {
			return rounded.toFixed(2)
		}
	}

	const formatPercent = (num: number) => {
		const rounded = Math.round(num * 100) / 100
		if (Number.isInteger(rounded)) {
			return rounded
		} else {
			return rounded.toFixed(1)
		}
	}
</script>

<header class="flex items-center gap-4 p-4">
	<a class="mr-auto px-2" href="/">
		<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 576 512"
			><!--! Home Icon - Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
			<path
				d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
			/>
		</svg>
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
		<section
			class="mb-4 grid grid-cols-2 items-center gap-4 rounded-xl bg-stone-200 p-4 shadow md:mb-8 md:p-8"
		>
			<h2 class="text-lg font-bold md:text-3xl">Overall Rank</h2>
			<p class="self-end md:text-2xl">Ranking Points</p>
			<p class="text-2xl font-semibold md:text-7xl">#{data.overallRank.rank}</p>
			<p class="self-end text-2xl md:text-6xl">{data.overallRank.total_points}</p>
		</section>
		<section
			class="mb-4 grid grid-cols-4 items-center gap-4 rounded-xl bg-stone-200 p-4 shadow md:mb-8 md:p-8"
		>
			<h2 class="col-span-2 text-lg font-bold md:text-3xl">Average Points per Tournament</h2>
			<p class="self-end md:text-2xl">Rank</p>
			<p class="self-end md:text-2xl">Percentile</p>
			<p class="col-span-2 text-2xl font-semibold md:text-7xl">
				{formatAvg(data.averagePoints.avg_points_per_draw)}
			</p>
			<p class="self-end text-2xl md:text-6xl">#{data.averagePoints.rank}</p>
			<p class="self-end text-2xl md:text-6xl">{formatPercent(data.averagePoints.percentile)}%</p>
		</section>
		<section
			class="mb-4 grid grid-cols-4 items-center gap-4 rounded-xl bg-stone-200 p-4 shadow md:mb-8 md:p-8"
		>
			<h2 class="col-span-2 text-lg font-bold md:text-3xl">Prediction Accuracy</h2>
			<p class="self-end md:text-2xl">Rank</p>
			<p class="self-end md:text-2xl">Percentile</p>
			<p class="col-span-2 text-2xl font-semibold md:text-7xl">
				{formatPercent(data.predictionAccuracy.percent_correct)}%
			</p>
			<p class="self-end text-2xl md:text-6xl">#{data.predictionAccuracy.rank}</p>
			<p class="self-end text-2xl md:text-6xl">
				{formatPercent(data.predictionAccuracy.percentile)}%
			</p>
			<p class="text-xs text-gray-500 md:text-lg">
				{`(${data.predictionAccuracy.correct}/${data.predictionAccuracy.total})`}
			</p>
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
						<a href={`/draw/${getSlug(drawResult)}`}>
							<li
								class={`grid w-full grid-cols-8 items-center gap-4 p-2 md:p-4 md:hover:brightness-105 ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'}`}
							>
								<p class="col-span-6 flex md:text-4xl">
									{getTitle(drawResult)}
								</p>
								<div
									class={`badge-icon mx-auto w-fit rounded-full px-2 text-lg md:h-10 md:min-w-10 md:text-3xl ${
										drawResult.prediction_count > 0 ? 'bg-green-400' : 'bg-red-300'
									}`}
								>
									{drawResult.total_points}
								</div>
								<div class="mx-auto">
									<Rank
										rank={drawResult.rank}
										textStyle="text-lg md:text-3xl font-extrabold"
										medalWidth={40}
									/>
								</div>
							</li>
						</a>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</main>
