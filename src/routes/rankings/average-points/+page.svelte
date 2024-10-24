<script lang="ts">
	import type { PbListResponse, AveragePoints } from '$lib/types'

	export let data: PbListResponse<AveragePoints>
</script>

<div class="bg-stone-100">{JSON.stringify(data)}</div>
