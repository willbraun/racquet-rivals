<script lang="ts">
	import type { ProfilePageData } from '$lib/types'
	import NavMenu from '$lib/NavMenu.svelte'
	import { format } from 'date-fns'
	import HowToPlay from '$lib/HowToPlay.svelte'

	export let data: ProfilePageData
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
	<div class="mx-auto max-w-screen-lg px-4 [&>section]:mb-8 md:[&>section]:mb-24">
		<section>
			<h1 class="mb-4 text-4xl font-bold md:text-7xl">{data.username}</h1>
			<p class="sm:text-2xl">Joined {format(new Date(data.created), 'MMM dd, yyyy')}</p>
		</section>
		<section class="grid grid-cols-2 items-center gap-4">
			<h2 class="text-lg font-bold md:text-3xl">Overall Ranking</h2>
			<p class="self-end md:text-2xl">Ranking Points</p>
			<p class="text-2xl font-semibold md:text-7xl">#{data.overallRank.rank}</p>
			<p class="self-end text-2xl md:text-6xl">{data.overallRank.total_points}</p>
		</section>
		<section class="grid grid-cols-4 items-center gap-4">
			<h2 class="col-span-2 text-lg font-bold md:text-3xl">Average Points per Tournament</h2>
			<p class="self-end md:text-2xl">Ranking</p>
			<p class="self-end md:text-2xl">Percentile</p>
			<p class="col-span-2 text-2xl font-semibold md:text-7xl">
				{data.averagePoints.avg_points_per_draw}
			</p>
			<p class="self-end text-2xl md:text-6xl">#{data.averagePoints.rank}</p>
			<p class="self-end text-2xl md:text-6xl">{data.averagePoints.percentile.toFixed(1)}%</p>
		</section>
		<section class="grid grid-cols-4 items-center gap-4">
			<h2 class="col-span-2 text-lg font-bold md:text-3xl">Prediction Accuracy</h2>
			<p class="self-end md:text-2xl">Ranking</p>
			<p class="self-end md:text-2xl">Percentile</p>
			<p class="col-span-2 text-2xl font-semibold md:text-7xl">
				{data.predictionAccuracy.percent_correct.toFixed(1)}%
			</p>
			<p class="self-end text-2xl md:text-6xl">#{data.predictionAccuracy.rank}</p>
			<p class="self-end text-2xl md:text-6xl">{data.predictionAccuracy.percentile.toFixed(1)}%</p>
			<p class="text-gray-500">
				{`(${data.predictionAccuracy.correct}/${data.predictionAccuracy.total})`}
			</p>
		</section>
	</div>
</main>
