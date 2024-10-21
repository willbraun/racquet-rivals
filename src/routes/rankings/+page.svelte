<script lang="ts">
	import type { RankingsPageData } from '$lib/types'

	export let data: RankingsPageData
</script>

<p>{JSON.stringify(data)}</p>
