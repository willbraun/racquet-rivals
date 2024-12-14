<script lang="ts">
	import { isMobile } from '$lib/store'
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
		onclick={() => {
			drawerStore.close()
			setTimeout(() => drawerStore.open(drawerSettings), 250)
		}}
		class="grid w-full grid-cols-4 items-center gap-4"
		data-testid="share-link-icon"
	>
		<img src={share} alt="share" width="24" class="justify-self-center" />
		<p class="col-span-3 justify-self-start text-xl">Share</p>
	</button>
{/if}
