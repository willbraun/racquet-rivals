<script lang="ts">
	import type { PbListResponse, PredictionAccuracy } from '$lib/types'

	export let data: PbListResponse<PredictionAccuracy>
</script>

<p>{JSON.stringify(data)}</p>
