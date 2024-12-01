<script lang="ts">
	import LogoutForm from './LogoutForm.svelte'
	import user from '$lib/images/icons/user-solid.svg'
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import trophy from '$lib/images/icons/trophy-solid.svg'
	import login from '$lib/images/icons/arrow-right-to-bracket-solid.svg'
	import logout from '$lib/images/icons/arrow-right-from-bracket-solid.svg'
	import signup from '$lib/images/icons/user-plus-solid.svg'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import ShareLink from './ShareLink.svelte'
	import { isAuth, currentUsername, drawNavUrl } from '$lib/store'
	import infoIcon from '$lib/images/icons/circle-info-solid.svg'

	const drawerStore = getDrawerStore()
	const closeDrawer = () => {
		drawerStore.close()
	}
</script>

{#snippet about()}
	<a href="/about" class="grid w-full grid-cols-4 items-center gap-4" onclick={closeDrawer}>
		<img src={infoIcon} alt="info" width="24" class="justify-self-center" />
		<p class="col-span-3 text-xl">About</p>
	</a>
{/snippet}

<nav class="flex h-full w-full flex-col items-start gap-8 p-8">
	{#if $isAuth}
		<a
			href={`/profile/${$currentUsername}`}
			class="grid w-full grid-cols-4 items-center gap-4"
			onclick={closeDrawer}
		>
			<img src={user} alt="user" width="18" class="justify-self-center" />
			<p class="col-span-3 text-xl">My Profile</p>
		</a>
		<a href={$drawNavUrl} class="grid w-full grid-cols-4 items-center gap-4" onclick={closeDrawer}>
			<img src={bracketLeft} alt="draws" width="24" class="justify-self-center" />
			<p class="col-span-3 text-xl">Draws</p>
		</a>
		<a href={`/rankings`} class="grid w-full grid-cols-4 items-center gap-4" onclick={closeDrawer}>
			<img src={trophy} alt="rankings" width="24" class="justify-self-center" />
			<p class="col-span-3 text-xl">Rankings</p>
		</a>
		<ShareLink />
		{@render about()}
		<LogoutForm>
			<button
				type="submit"
				class="grid w-full grid-cols-4 items-center gap-4"
				onclick={closeDrawer}
			>
				<img src={logout} alt="logout" width="24" class="justify-self-center" />
				<p class="text-xl">Logout</p>
			</button>
		</LogoutForm>
	{:else}
		<a href="/login" class="grid w-full grid-cols-4 items-center gap-4" onclick={closeDrawer}>
			<img src={login} alt="login" width="24" class="justify-self-center" />
			<p class="col-span-3 text-xl">Login</p>
		</a>
		<a
			href="/create-account"
			class="grid w-full grid-cols-4 items-center gap-4"
			onclick={closeDrawer}
		>
			<img src={signup} alt="sign up" width="24" class="justify-self-center" />
			<p class="col-span-3 text-xl">Sign up</p>
		</a>
		<ShareLink />
		{@render about()}
	{/if}
</nav>
