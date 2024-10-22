<script lang="ts">
	import type { PbListResponse, PredictionAccuracy } from '$lib/types'

	export let data: PbListResponse<PredictionAccuracy>
</script>

<main class="bg-stone-100">{JSON.stringify(data)}</main>
