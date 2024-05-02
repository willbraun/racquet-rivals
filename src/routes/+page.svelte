<script lang="ts">
	import Pocketbase from 'pocketbase'
	import Logout from '$lib/Logout.svelte'
	import { afterNavigate } from '$app/navigation'
	import { isAuth } from '$lib/store.js'
	import { getSlug, getTitle, updatePageAuth } from '$lib/utils.js'
	import bracketLeft from '$lib/images/bracket-left.svg'
	import { onMount } from 'svelte'
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	import HowToPlay from '$lib/HowToPlay.svelte'
	export let data

	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

	isAuth.set(data.pb_auth_valid)
	afterNavigate(() => updatePageAuth(pb, data.pb_auth_valid, data.pb_auth_cookie))

	const pillStyle =
		'flex justify-center items-center text-center text-lg sm:text-xl md:text-2xl rounded-full px-6 py-2'

	onMount(() => {
		sessionStorage.setItem('loginGoto', '/')
	})
</script>

<header class="absolute top-0 right-0 flex justify-end items-center gap-2 p-4">
	<HowToPlay />
	{#if $isAuth}
		<Logout />
	{/if}
</header>
<main class="w-full h-max p-4 bg-stone-100">
	<div class="max-w-5xl mx-auto h-full">
		<section class="mb-16">
			<div class="grid grid-cols-4 items-center my-16">
				<img src={bracketLeft} alt="left bracket" />
				<h1
					class="col-span-2 text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-center font-bold tracking-tight whitespace-pre-line"
				>
					{'Racquet\nRivals'}
				</h1>
				<img src={bracketLeft} alt="right bracket" class="rotate-180" />
			</div>
			{#if $isAuth}
				<div class="{pillStyle} shadow-lg col-start-1 col-end-2 bg-blue-300 w-fit mx-auto">
					Welcome {data.pb_auth_username}!
				</div>
			{:else}
				<div class="grid grid-rows-4 grid-cols-2 gap-4">
					<div class="{pillStyle} shadow-xl col-start-1 col-end-3 sm:col-end-2 bg-blue-300">
						Create brackets for the last 16 players of pro tennis tournaments
					</div>
					<div
						class="{pillStyle} shadow-xl row-start-2 col-start-1 sm:col-start-2 col-end-3 bg-orange-300"
					>
						Earn points if your players win, and see how you stack up with your friends
					</div>
					<a
						href="/login"
						class="block {pillStyle} shadow-xl font-semibold row-start-3 col-start-1 col-end-3 sm:col-end-2 bg-yellow-200 hover:scale-105 duration-100"
					>
						<button type="button">Login</button>
					</a>
					<a
						href="/create-account"
						class="block {pillStyle} shadow-xl font-semibold row-start-4 col-start-1 sm:col-start-2 col-end-3 bg-purple-300 hover:scale-105 duration-100"
					>
						<button type="button">Sign up</button>
					</a>
				</div>
			{/if}
		</section>
		<section class="mb-24">
			<h3
				class="text-2xl sm:text-4xl text-center rounded-xl p-4 text-white font-bold bg-orange-600 shadow-lg mb-8 mx-4"
			>
				Join us for the next major tournament - the French Open!<br /><br /> May 26, 2024 - June 9, 2024
			</h3>
			<h3 class="text-4xl sm:text-6xl text-center mb-8">Active Draws</h3>
			{#if data.active.totalItems > 0}
				{#each data.active.items as draw}
					<a
						href={`/draw/${getSlug(draw)}`}
						class="{pillStyle} shadow-lg bg-green-300 p-4 mb-4 w-fit mx-auto hover:scale-105 duration-100"
					>
						<button type="button">
							{getTitle(draw)}
						</button>
					</a>
				{/each}
			{:else}
				<p class="text-center text-xl mb-16">No active draws</p>
			{/if}
			<h3 class="text-4xl sm:text-6xl text-center mt-16 mb-8">Completed Draws</h3>
			{#if data.completed.totalItems > 0}
				{#each data.completed.items as draw}
					<a
						href={`/draw/${getSlug(draw)}`}
						class="{pillStyle} shadow-lg bg-slate-300 p-4 mb-4 w-fit mx-auto hover:scale-105 duration-100"
					>
						<button type="button">
							{getTitle(draw)}
						</button>
					</a>
				{/each}
			{:else}
				<p class="text-center text-xl">No completed draws</p>
			{/if}
		</section>
	</div>
</main>
