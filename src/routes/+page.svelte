<script lang="ts">
	import { errorMessage } from '$lib/utils'
	import Pocketbase from 'pocketbase'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	const refreshToken = async () => {
		try {
			pb.authStore.isValid && (await pb.collection('user').authRefresh())
		} catch (e) {
			pb.authStore.clear()
		}
	}

	refreshToken()
</script>

<header class="flex justify-end gap-2 p-2">
	{#if pb.authStore.isValid}
		<a data-sveltekit-reload href="/">
			<button
				type="button"
				class="btn variant-ghost rounded-xl"
				on:click={() => {
					try {
						pb.authStore.clear()
					} catch (e) {
						errorMessage(e)
					}
				}}>Logout</button
			>
		</a>
	{:else}
		<a href="/login">
			<button type="button" class="btn variant-ghost rounded-xl">Login</button>
		</a>
		<a href="/create-account">
			<button type="button" class="btn variant-filled rounded-xl">Sign up</button>
		</a>
	{/if}
</header>
<div class="mx-auto max-w-xl px-4">
	<section class="my-6">
		<h1 class="mb-6 text-7xl text-center">Tennis Bracket</h1>
		<h2 class="mb-6 font-light text-center text-xl">
			Create a bracket for the last 16 players of pro tennis tournaments, and see how you stack up
			with your friends.
		</h2>
		{#if !pb.authStore.isValid}
			<p class="text-center mb-2">Log in to create a bracket</p>
			<div class="flex justify-center gap-2 w-full">
				<a href="/login">
					<button type="button" class="btn variant-ghost rounded-xl w-40">Login</button>
				</a>
				<a href="/create-account">
					<button type="button" class="btn variant-filled rounded-xl w-40">Sign up</button>
				</a>
			</div>
		{/if}
	</section>
	<section>
		<h3 class="text-3xl mb-4">Active Draws</h3>
		<a href="/">
			<button type="button" class="btn variant-ringed rounded-xl w-full mb-4"
				>Australian Open Mens Singles 2024</button
			>
		</a>
		<a href="/">
			<button type="button" class="btn variant-ringed rounded-xl w-full mb-4"
				>Australian Open Womens Singles 2024</button
			>
		</a>
	</section>
	<section>
		<h3 class="text-3xl mb-4">Completed Draws</h3>
		<a href="/">
			<button type="button" class="btn variant-ringed rounded-xl w-full mb-4"
				>US Open Mens Singles 2023</button
			>
		</a>
		<a href="/">
			<button type="button" class="btn variant-ringed rounded-xl w-full mb-4"
				>US Open Womens Singles 2023</button
			>
		</a>
	</section>
</div>
