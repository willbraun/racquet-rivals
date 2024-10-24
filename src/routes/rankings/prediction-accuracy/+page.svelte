<script lang="ts">
	import type { PbListResponse, PredictionAccuracy } from '$lib/types'

	export let data: PbListResponse<PredictionAccuracy>
</script>

<div class="bg-stone-100">{JSON.stringify(data)}</div>
