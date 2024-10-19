<script lang="ts">
	import { initializeStores, storePopup } from '@skeletonlabs/skeleton'
	import Page from './+page.svelte'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	import type { DrawPageData } from '$lib/types'
	export let data: DrawPageData

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	initializeStores()
</script>

<Page {data} />
