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
	<button on:click={() => drawerStore.open(drawerSettings)} data-testid="share-link-icon">
		<img src={share} alt="share via text" width="24" class="mr-auto" />
	</button>
{/if}
