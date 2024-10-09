<script lang="ts">
	import hamburger from '$lib/images/icons/hamburger-menu.svg'
	import user from '$lib/images/icons/user-solid.svg'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import type { DrawerSettings } from '@skeletonlabs/skeleton'
	import { isAuth } from './store'
	import LogoutForm from './LogoutForm.svelte'
	import LogoutButton from './LogoutButton.svelte'

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: 'nav-menu',
		position: 'right',
		width: 'w-52'
	}
</script>

<button
	on:click={() => drawerStore.open(drawerSettings)}
	class="sm:hidden"
	data-testid="user-menu-icon"
>
	<img src={hamburger} alt="hamburger menu icon" width="24" />
</button>
<div class="hidden sm:block">
	{#if $isAuth}
		<div class="flex items-center gap-4">
			<a href="/profile/will">
				<img src={user} alt="user" width="18" />
			</a>
			<LogoutForm>
				<LogoutButton />
			</LogoutForm>
		</div>
	{:else}
		<a href="/login">
			<button type="button" class="btn btn-sm rounded-lg bg-black text-white md:btn-md"
				>Login</button
			>
		</a>
		<a href="/create-account">
			<button type="button" class="btn btn-sm rounded-lg bg-black text-white md:btn-md"
				>Sign up</button
			>
		</a>
	{/if}
</div>
