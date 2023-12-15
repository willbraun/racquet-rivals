<script lang="ts">
	import Pocketbase from 'pocketbase'
	import Logout from '$lib/Logout.svelte'
	import { afterNavigate } from '$app/navigation'
	import { isAuth } from '$lib/store.js'
	import { getSlug, getTitle, updatePageAuth } from '$lib/utils.js'
	export let data

	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	isAuth.set(data.pb_auth_valid)
	afterNavigate(() => updatePageAuth(pb, data.pb_auth_valid, data.pb_auth_cookie))
</script>

<header class="absolute right-2 flex justify-end gap-2 p-2 h-12">
	{#if $isAuth}
		<Logout />
	{/if}
</header>
<main class="w-full h-max px-4 bg-primary-500 text-white">
	<div class="h-full max-w-3xl mx-auto bg-secondary-500 border-white border-x-16 [&>section]:p-16">
		<section class="border-white border-b-16">
			<h1 class="mb-6 text-7xl text-center font-bold">Tennis Bracket</h1>
			{#if $isAuth}
				<p class="text-center text-xl font-bold">Welcome back, {data.pb_auth_username}!</p>
			{:else}
				<p class="mb-6 text-center text-xl">
					Create a bracket for the last 16 players of pro tennis tournaments, and see how you stack
					up with your friends.
				</p>
				<p class="text-center mb-2">Log in to create a bracket</p>
				<div class="flex justify-center gap-2 w-full">
					<a href="/login">
						<button type="button" class="btn bg-slate-800 rounded-lg w-40">Login</button>
					</a>
					<a href="/create-account">
						<button type="button" class="btn bg-slate-800 rounded-lg w-40">Sign up</button>
					</a>
				</div>
			{/if}
		</section>
		<section>
			<h3 class="text-3xl mb-4">Active Draws</h3>
			{#if data.active.totalItems > 0}
				{#each data.active.items as draw}
					<a href={`/draw/${getSlug(draw)}`}>
						<button type="button" class="btn variant-ghost rounded-xl w-full mb-4">
							{getTitle(draw)}
						</button>
					</a>
				{/each}
			{:else}
				<p class="text-center mb-4">No active draws</p>
			{/if}
			<h3 class="text-3xl pt-4 mb-4">Completed Draws</h3>
			{#if data.completed.totalItems > 0}
				{#each data.completed.items as draw}
					<a href={`/draw/${getSlug(draw)}`}>
						<button type="button" class="btn variant-ghost rounded-xl w-full mb-4">
							{getTitle(draw)}
						</button>
					</a>
				{/each}
			{:else}
				<p class="text-center">No completed draws</p>
			{/if}
		</section>
	</div>
</main>
