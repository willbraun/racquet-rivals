<script lang="ts">
	import Rank from '$lib/components/Rank.svelte'
	import type { PbListResponse, OverallRank } from '$lib/types'

	export let data: PbListResponse<OverallRank>
</script>

<table class="w-full overflow-hidden rounded-xl shadow">
	<thead class="bg-primary-700 text-xl text-white md:text-3xl">
		<tr class="grid grid-cols-4 p-4">
			<th>Rank</th>
			<th class="col-span-2">User</th>
			<th>Total Points</th>
		</tr>
	</thead>
	<tbody>
		{#each data.items as item, index}
			<a href={`/profile/${item.username}`}>
				<tr
					class={`grid h-16 grid-cols-4 items-center text-center text-2xl md:h-20 md:text-3xl md:hover:brightness-105 ${index % 2 ? 'bg-primary-50' : 'bg-primary-200'}`}
				>
					<td
						><Rank
							rank={item.rank}
							containerStyle="w-10 md:w-12 mx-auto"
							textStyle="font-bold"
						/></td
					>
					<td class="col-span-2">{item.username}</td>
					<td>
						<div
							class={`badge-icon mx-auto h-8 w-fit rounded-full bg-green-400 px-2 text-xl md:h-10 md:min-w-10 md:text-3xl`}
						>
							{item.total_points}
						</div>
					</td>
				</tr>
			</a>
		{/each}
	</tbody>
</table>
