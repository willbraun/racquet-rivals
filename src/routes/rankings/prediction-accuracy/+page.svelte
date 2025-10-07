<script lang="ts">
	import { goto } from '$app/navigation'
	import Rank from '$lib/components/Rank.svelte'
	import { rankingDescriptions } from '$lib/data'
	import type { PredictionAccuracy, RankingsPageData } from '$lib/types'
	import { formatPercent } from '$lib/utils'

	interface Props {
		data: RankingsPageData<PredictionAccuracy>
	}

	let { data }: Props = $props()
</script>

<p class="pb-8 sm:text-xl">
	{rankingDescriptions.predictionAccuracy}
</p>
<table class="w-full overflow-hidden rounded-xl shadow">
	<thead class="bg-primary-700 text-xl text-white md:text-3xl">
		<tr class="grid grid-cols-5 gap-2 p-2 md:py-4">
			<th>Rank</th>
			<th class="col-span-2 text-start">User</th>
			<th class="sm:hidden">%</th>
			<th class="hidden sm:block">Accuracy</th>
			<th>Ratio</th>
		</tr>
	</thead>
	<tbody>
		{#each data.rankings.items as item, index (item.id)}
			<tr
				class={`grid min-h-16 grid-cols-5 items-center gap-2 px-2 text-start text-xl hover:cursor-pointer hover:brightness-105 md:min-h-20 md:text-3xl ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'}`}
				onclick={() => goto(`/profile/${item.username}`)}
			>
				<td
					><Rank rank={item.rank} containerStyle="w-10 md:w-12 mx-auto" textStyle="font-bold" /></td
				>
				<td class="col-span-2">
					<p class="text-wrap break-words">{item.username}</p>
				</td>
				<td>
					<p class="text-center font-bold md:text-3xl">
						{formatPercent(item.percent_correct)}
					</p>
				</td>
				<td class="hidden text-center sm:block md:text-3xl">
					<p>
						{item.correct}/{item.total}
					</p>
				</td>
				<td class="text-center text-base sm:hidden md:text-xl">
					<p>
						{item.correct}
					</p>
					<p class="mx-auto w-fit border-t-1 border-black">
						{item.total}
					</p>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
