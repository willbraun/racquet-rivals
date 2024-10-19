<script lang="ts">
	import { isMobile } from './store'
	import share from '$lib/images/icons/share-from-square-solid.svg'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import type { DrawerSettings } from '@skeletonlabs/skeleton'

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: 'share-link',
		position: 'bottom'
	}
</script>

{#if $isMobile}
	<button
		on:click={() => {
			drawerStore.close()
			setTimeout(() => drawerStore.open(drawerSettings), 250)
		}}
		class="flex w-full gap-4"
		data-testid="share-link-icon"
	>
		<img src={share} alt="share" width="24" />
		<p class="text-xl">Share</p>
	</button>
{/if}
