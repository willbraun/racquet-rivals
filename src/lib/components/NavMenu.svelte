<script lang="ts">
	import hamburger from '$lib/images/icons/hamburger-menu.svg'
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import user from '$lib/images/icons/user-solid.svg'
	import trophy from '$lib/images/icons/trophy-solid.svg'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import type { DrawerSettings } from '@skeletonlabs/skeleton'
	import LogoutButton from './LogoutButton.svelte'
	import { isAuth, currentUser, drawNavUrl } from '$lib/store'
	import infoIcon from '$lib/images/icons/circle-info-solid.svg'

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: 'nav-menu',
		position: 'right',
		width: 'w-52'
	}

	interface Props {
		isInverted: boolean
	}

	let { isInverted }: Props = $props()

	const buttonStyle = `btn btn-sm rounded-lg ${isInverted ? 'bg-white text-black' : 'bg-black text-white'}`
</script>

<button
	onclick={() => drawerStore.open(drawerSettings)}
	class="block flex-shrink-0 sm:hidden"
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
<nav class="hidden flex-shrink-0 sm:block">
	<div class="flex items-center gap-4">
		<a href={$drawNavUrl}>
			<img src={bracketLeft} alt="draws" width="24" class:invert={isInverted} />
		</a>
		{#if $isAuth}
			<a href={`/profile/${$currentUser?.username}`}>
				<img src={user} alt="profile" width="18" class:invert={isInverted} />
			</a>
		{/if}
		<a href={`/rankings`}>
			<img src={trophy} alt="rankings" width="24" class:invert={isInverted} />
		</a>
		<a href="/about">
			<img src={infoIcon} alt="about" width="24" class:invert={isInverted} />
		</a>
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
