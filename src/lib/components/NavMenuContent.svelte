<script lang="ts">
	import LogoutButton from './LogoutButton.svelte'
	import user from '$lib/images/icons/user-solid.svg'
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import trophy from '$lib/images/icons/trophy-solid.svg'
	import login from '$lib/images/icons/arrow-right-to-bracket-solid.svg'
	import logout from '$lib/images/icons/arrow-right-from-bracket-solid.svg'
	import signup from '$lib/images/icons/user-plus-solid.svg'
	import { getDrawerStore } from '@skeletonlabs/skeleton'
	import ShareLink from './ShareLink.svelte'
	import { isAuth, currentUser, drawNavUrl } from '$lib/store'
	import infoIcon from '$lib/images/icons/circle-info-solid.svg'
	import dollarSign from '$lib/images/icons/dollar-sign-solid.svg'
	import gear from '$lib/images/icons/gear-solid.svg'

	const drawerStore = getDrawerStore()
	const closeDrawer = () => {
		drawerStore.close()
	}
</script>

{#snippet menuLink(name: string, image: string, alt: string, imgWidth: number, url: string)}
	<a href={url} class="grid w-full grid-cols-4 items-center gap-4" onclick={closeDrawer}>
		<img src={image} {alt} width={imgWidth} class="justify-self-center" />
		<p class="col-span-3 text-xl">{name}</p>
	</a>
{/snippet}

{#snippet about()}
	{@render menuLink('About', infoIcon, 'info', 24, '/about')}
{/snippet}

<nav class="flex h-full w-full flex-col items-start gap-8 p-8">
	{@render menuLink('Draws', bracketLeft, 'draws', 24, $drawNavUrl)}
	{@render menuLink('Rankings', trophy, 'rankings', 24, '/rankings')}
	{#if $isAuth}
		{@render menuLink('My Profile', user, 'profile', 18, `/profile/${$currentUser?.username}`)}
		{@render menuLink('My Account', gear, 'account', 24, '/my-account')}
	{/if}
	{@render menuLink('Pricing', dollarSign, 'pricing', 16, '/pricing')}
	{@render about()}
	<ShareLink />
	{#if $isAuth}
		<LogoutButton styles={'w-full'} onLogout={closeDrawer}>
			<div class="grid w-full grid-cols-4 items-center gap-4">
				<img src={logout} alt="logout" width="24" class="justify-self-center" />
				<p class="col-span-3 justify-self-start text-xl">Log out</p>
			</div>
		</LogoutButton>
	{:else}
		{@render menuLink('Log in', login, 'login', 24, '/login')}
		{@render menuLink('Sign up', signup, 'sign up', 24, '/create-account')}
	{/if}
</nav>
