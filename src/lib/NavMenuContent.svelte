<script lang="ts">
	import LogoutForm from './LogoutForm.svelte'
	import user from '$lib/images/icons/user-solid.svg'
	import login from '$lib/images/icons/arrow-right-to-bracket-solid.svg'
	import logout from '$lib/images/icons/arrow-right-from-bracket-solid.svg'
	import signup from '$lib/images/icons/user-plus-solid.svg'
	import { isAuth } from './store'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import ShareLink from './ShareLink.svelte'

	const drawerStore = getDrawerStore()
	const closeDrawer = () => {
		drawerStore.close()
	}
</script>

<div class="flex h-full w-full flex-col items-start gap-8 p-8">
	{#if $isAuth}
		<a href="/profile/will" class="flex w-full items-center gap-4" on:click={closeDrawer}>
			<img src={user} alt="user" width="18" />
			<p class="text-xl">My Profile</p>
		</a>
		<ShareLink />
		<LogoutForm>
			<button type="submit" class="flex w-full items-center gap-4" on:click={closeDrawer}>
				<img src={logout} alt="logout" width="24" />
				<p class="text-xl">Log out</p>
			</button>
		</LogoutForm>
	{:else}
		<a href="/login" class="flex w-full gap-4" on:click={closeDrawer}>
			<img src={login} alt="login" width="24" />
			<p class="text-xl">Login</p>
		</a>
		<a href="/create-account" class="flex w-full gap-4" on:click={closeDrawer}>
			<img src={signup} alt="sign up" width="24" />
			<p class="text-xl">Sign up</p>
		</a>
	{/if}
</div>
