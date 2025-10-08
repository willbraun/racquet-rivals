<script lang="ts">
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import hamburger from '$lib/images/icons/hamburger-menu.svg'
	import trophy from '$lib/images/icons/trophy-solid.svg'
	import user from '$lib/images/icons/user-solid.svg'
	import { currentUser, drawNavUrl, isAuth } from '$lib/store'
	import type { DrawerSettings } from '@skeletonlabs/skeleton'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import LogoutButton from './LogoutButton.svelte'

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: 'nav-menu',
		position: 'right',
		width: 'w-64'
	}

	interface Props {
		isInverted: boolean
	}

	let { isInverted }: Props = $props()

	const buttonStyle = `btn btn-sm rounded-lg ${isInverted ? 'bg-white text-black' : 'bg-black text-white'}`
</script>

<button
	onclick={() => drawerStore.open(drawerSettings)}
	class="block shrink-0 sm:hidden"
	data-testid="user-menu-icon"
>
	<img
		src={hamburger}
		alt="hamburger menu icon"
		width="24"
		data-testid="hamburger-icon"
		class:invert={isInverted}
	/>
</button>
<nav class="hidden shrink-0 sm:block">
	<div class="flex items-center gap-4">
		<a href={$drawNavUrl}>
			<img src={bracketLeft} alt="draws" width="24" class:invert={isInverted} />
		</a>
		<a href="/rankings">
			<img src={trophy} alt="rankings" width="24" class:invert={isInverted} />
		</a>
		{#if $isAuth}
			<a href={`/profile/${$currentUser?.username}`}>
				<img src={user} alt="profile" width="18" class:invert={isInverted} />
			</a>
		{/if}
		{#if $isAuth}
			<LogoutButton>
				<div class={buttonStyle}>Log out</div>
			</LogoutButton>
		{:else}
			<a href="/login">
				<button type="button" class={buttonStyle}>Log in</button>
			</a>
			<a href="/create-account">
				<button type="button" class={buttonStyle}>Sign up</button>
			</a>
		{/if}
	</div>
</nav>
