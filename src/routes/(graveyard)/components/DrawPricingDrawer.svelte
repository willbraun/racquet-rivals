<script lang="ts">
		import DrawPricingContent from './DrawPricingContent.svelte'
	import type { Draw } from '$lib/types'

	interface Props {
		draw: Draw
		mensDraw: Draw | undefined
		womensDraw: Draw | undefined
	}

	let { draw, mensDraw, womensDraw }: Props = $props()

	const drawerStore = getDrawerStore()

	const handleClose = () => {
		drawerStore.close()
	}
</script>

<div class="p-4">
	<DrawPricingContent {draw} {mensDraw} {womensDraw} onClose={handleClose} />
</div>
