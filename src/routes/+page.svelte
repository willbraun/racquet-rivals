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

<h1>Home</h1>

{#if pb.authStore.isValid}
	<a data-sveltekit-reload href="/">
		<button
			type="button"
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
	<a href="/login">Login</a>
{/if}
