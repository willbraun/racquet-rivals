<script lang="ts">
	import { isAuth } from './store'
	import share from '$lib/images/icons/share-from-square-solid.svg'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import type { DrawerSettings } from '@skeletonlabs/skeleton'
	export let currentUser = ''

	const message = $isAuth
		? `Join me (${currentUser}) on Racquet Rivals! Click here to play - https://racquetrivals.com`
		: 'Check out Racquet Rivals! Click here to play - https://racquetrivals.com'
	const encoded = encodeURIComponent(message)

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: 'share-link',
		position: 'bottom',
		meta: { encoded }
	}
</script>

<button on:click={() => drawerStore.open(drawerSettings)}>
	<img src={share} alt="share via text" width="24" class="mr-auto" />
</button>
