<script lang="ts">
	import hamburger from '$lib/images/icons/hamburger-menu.svg'
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import user from '$lib/images/icons/user-solid.svg'
	import trophy from '$lib/images/icons/trophy-solid.svg'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import type { DrawerSettings } from '@skeletonlabs/skeleton'
	import LogoutForm from './LogoutForm.svelte'
	import { isAuth, currentUsername, drawNavUrl } from '$lib/store'
	import HowToPlay from './HowToPlay.svelte'

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: 'nav-menu',
		position: 'right',
		width: 'w-52'
	}
</script>

<button
	onclick={() => drawerStore.open(drawerSettings)}
	class="block flex-shrink-0 sm:hidden"
	data-testid="user-menu-icon"
>
	<img src={hamburger} alt="hamburger menu icon" width="24" data-testid="hamburger-icon" />
</button>
<nav class="hidden flex-shrink-0 sm:block">
	<div class="flex items-center gap-4">
		<HowToPlay />
		{#if $isAuth}
			<a href={$drawNavUrl}>
				<img src={bracketLeft} alt="draws" width="24" />
			</a>
			<a href={`/profile/${$currentUsername}`}>
				<img src={user} alt="profile" width="18" />
			</a>
			<a href={`/rankings`}>
				<img src={trophy} alt="rankings" width="24" />
			</a>
			<LogoutForm>
				<button type="submit" class="btn btn-sm rounded-lg bg-black text-white"> Logout </button>
			</LogoutForm>
		{:else}
			<a href="/login">
				<button type="button" class="btn btn-sm rounded-lg bg-black text-white">Login</button>
			</a>
			<a href="/create-account">
				<button type="button" class="btn btn-sm rounded-lg bg-black text-white">Sign up</button>
			</a>
		{/if}
	</div>
</nav>
