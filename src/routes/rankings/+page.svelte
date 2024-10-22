<script lang="ts">
	import type { PbListResponse, OverallRank } from '$lib/types'

	export let data: PbListResponse<OverallRank>
</script>

<p>{JSON.stringify(data)}</p>
