<script lang="ts">
	import { initializeStores, storePopup } from '@skeletonlabs/skeleton'
	import Page from '../../../routes/+page.svelte'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	import type { HomePageData } from '$lib/types'
	export let data: HomePageData

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	initializeStores()
</script>

<Page {data} />
