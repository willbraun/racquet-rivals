<script lang="ts">
	import { goto } from '$app/navigation'
	import Rank from '$lib/components/Rank.svelte'
	import { rankingDescriptions } from '$lib/data'
	import type { OverallRank, RankingsPageData } from '$lib/types'

	interface Props {
		data: RankingsPageData<OverallRank>
	}

	let { data }: Props = $props()
</script>

<p class="pb-8 sm:text-xl">
	{rankingDescriptions.overall}
</p>
<table class="w-full overflow-hidden rounded-xl shadow-sm">
	<thead class="bg-primary-700 text-xl text-white md:text-3xl">
		<tr class="grid grid-cols-4 gap-2 p-2 md:py-4">
			<th>Rank</th>
			<th class="col-span-2 text-start">User</th>
			<th>Points</th>
		</tr>
	</thead>
	<tbody>
		{#each data.rankings.items as item, index (item.id)}
			<tr
				class={`grid min-h-16 grid-cols-4 items-center gap-2 px-2 text-start text-xl hover:cursor-pointer hover:brightness-105 md:min-h-20 md:text-3xl ${index % 2 ? 'bg-primary-50' : 'bg-primary-100'}`}
				onclick={() => goto(`/profile/${item.username}`)}
			>
				<td
					><Rank rank={item.rank} containerStyle="w-10 md:w-12 mx-auto" textStyle="font-bold" /></td
				>
				<td class="col-span-2">
					<p class="text-wrap break-words">{item.username}</p>
				</td>
				<td class="flex justify-center">
					<div
						class="badge-icon w-fit rounded-full bg-green-400 px-2.5 text-lg font-bold shadow-sm md:h-8 md:min-w-8 md:text-3xl"
					>
						{item.total_points}
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
