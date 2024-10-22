<script lang="ts">
	import type { PbListResponse, AveragePoints } from '$lib/types'

	export let data: PbListResponse<AveragePoints>
</script>

<p>{JSON.stringify(data)}</p>
