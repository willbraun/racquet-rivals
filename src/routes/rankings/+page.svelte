<script lang="ts">
	import type { PbListResponse, OverallRank } from '$lib/types'

	export let data: PbListResponse<OverallRank>
</script>

<main class="bg-stone-100">{JSON.stringify(data)}</main>
