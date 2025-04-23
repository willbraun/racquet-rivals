<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import DrawPricingContent from './DrawPricingContent.svelte'
	import type { Draw } from '$lib/types'

	interface Props {
		draw: Draw
	}

	let { draw }: Props = $props()

	const drawerStore = getDrawerStore()

	const handleClose = () => {
		drawerStore.close()
	}
</script>

<div class="p-4">
	<header class="mb-4 rounded-lg bg-gradient-to-l from-primary-300 to-primary-500 p-4">
		<h2 class="text-2xl font-bold text-white">Purchase Entry</h2>
	</header>
	<DrawPricingContent {draw} onClose={handleClose} />
	<footer class="mt-6 flex justify-end gap-2">
		<button
			class="variant-soft btn transition-all duration-200 hover:variant-soft-primary"
			onclick={handleClose}
		>
			Close
		</button>
	</footer>
</div>
