<script lang="ts">
	import logout from '$lib/images/icons/arrow-right-from-bracket-solid.svg'
	import login from '$lib/images/icons/arrow-right-to-bracket-solid.svg'
	import bracketLeft from '$lib/images/icons/bracket-left.svg'
	import crown from '$lib/images/icons/crown-solid-full.svg'
	import trophy from '$lib/images/icons/trophy-solid.svg'
	import signup from '$lib/images/icons/user-plus-solid.svg'
	import user from '$lib/images/icons/user-solid.svg'
	import {
		currentUser,
		drawNavUrl,
		isAdmin,
		isAuth,
		navMenuOpen,
		scrapersHealthy
	} from '$lib/store'
	import type { Snippet } from 'svelte'
	import LogoutButton from './LogoutButton.svelte'
	import ShareLink from './ShareLink.svelte'

	const closeDrawer = () => {
		navMenuOpen.set(false)
	}
</script>

{#snippet menuLink(
	name: string,
	image: string,
	alt: string,
	imgWidth: number,
	url: string,
	extraSnippet?: Snippet
)}
	<a href={url} class="grid w-full grid-cols-4 items-center gap-4" onclick={closeDrawer}>
		<img src={image} {alt} width={imgWidth} class="justify-self-center" />
		<p class="{extraSnippet ? 'col-span-2' : 'col-span-3'} text-xl">{name}</p>
		{@render extraSnippet?.()}
	</a>
{/snippet}

{#snippet scrapersHealthStatus()}
	<span
		class="rounded-full py-1 text-center font-semibold {$scrapersHealthy
			? 'bg-green-100 text-green-800'
			: 'bg-red-100 text-red-800'}"
	>
		{$scrapersHealthy ? '✅' : '❌'}
	</span>
{/snippet}

<nav class="flex h-full w-full flex-col items-start gap-8 p-8">
	{@render menuLink('Draws', bracketLeft, 'draws', 24, $drawNavUrl)}
	{@render menuLink('Rankings', trophy, 'rankings', 24, '/rankings')}
	{#if $isAuth}
		{@render menuLink('Profile', user, 'profile', 18, `/profile/${$currentUser?.username}`)}
	{/if}
	{#if $isAdmin}
		{@render menuLink('Admin', crown, 'admin', 26, '/admin', scrapersHealthStatus)}
	{/if}
	<ShareLink />
	{#if $isAuth}
		<LogoutButton styles="w-full" onLogout={closeDrawer}>
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
