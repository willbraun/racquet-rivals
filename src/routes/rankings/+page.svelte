<script lang="ts">
	import Rank from '$lib/components/Rank.svelte'
	import type { PbListResponse, OverallRank } from '$lib/types'
	import { rankingDescriptions } from '$lib/data'

	export let data: PbListResponse<OverallRank>
</script>

<p class="pb-8 sm:text-xl">
	{rankingDescriptions.overall}
</p>
<table class="w-full overflow-hidden rounded-xl shadow">
	<thead class="bg-primary-700 text-xl text-white md:text-3xl">
		<tr class="grid grid-cols-4 gap-2 p-2 md:py-4">
			<th>Rank</th>
			<th class="col-span-2 text-start">User</th>
			<th>Points</th>
		</tr>
	</thead>
	<tbody>
		{#each data.items as item, index}
			<tr
				class={`grid h-16 grid-cols-4 items-center gap-2 px-2 text-start text-xl md:h-20 md:text-3xl md:hover:brightness-105 ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'}`}
			>
				<td
					><Rank rank={item.rank} containerStyle="w-10 md:w-12 mx-auto" textStyle="font-bold" /></td
				>
				<td class="col-span-2">
					<a href={`/profile/${item.username}`}>
						<p class="text-wrap break-words">{item.username}</p>
					</a>
				</td>
				<td>
					<div
						class={`badge-icon mx-auto h-7 w-fit rounded-full bg-green-400 px-2 text-xl md:h-10 md:min-w-10 md:text-3xl`}
					>
						{item.total_points}
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
