<script lang="ts">
	import { initializeStores, storePopup } from '@skeletonlabs/skeleton'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	export let component: ConstructorOfATypedSvelteComponent
	export let data: object = {}

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	initializeStores()
</script>

<svelte:component this={component} {data} />
