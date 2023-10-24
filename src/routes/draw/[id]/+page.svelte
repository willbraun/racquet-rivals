<script lang="ts">
	import { errorMessage } from '$lib/utils.js'
	import Pocketbase from 'pocketbase'
	export let data
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	const title = `${data.draw.name} ${data.draw.event} ${data.draw.year}`
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

<h1>{title}</h1>

<p>{JSON.stringify(data.slots.items)}</p>
