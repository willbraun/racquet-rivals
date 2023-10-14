<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { goto } from '$app/navigation'
	import { errorMessage } from '$lib/utils'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let usernameOrEmail = ''
	let password = ''
	let error = ''
	let loading = false

	const handleLogin = async () => {
		loading = true
		error = ''

		try {
			await pb.collection('user').authWithPassword(usernameOrEmail, password)
			goto('/')
		} catch (e) {
			error = errorMessage(e)
		}

		loading = false
	}
</script>

<div class="mt-12 m-auto p-4 max-w-md [&>*]:mb-4">
	<h1 class="text-3xl">Login</h1>
	<label class="label">
		<span>Username or email</span>
		<input class="input" type="text" bind:value={usernameOrEmail} />
	</label>
	<label class="label">
		<span>Password</span>
		<input class="input" type="password" bind:value={password} />
	</label>

	<div class="flex justify-center">
		<button
			type="button"
			class="btn variant-filled w-1/2 mt-4 mx-auto text-xl font-semibold"
			disabled={loading}
			on:click={handleLogin}
		>
			{loading ? 'Logging in...' : 'Log in'}
		</button>
	</div>

	<p class="text-sm text-red-500 whitespace-pre-line">{error}</p>

	<div class="mt-6">
		<p>Don't have an account? Create one <a class="underline" href="/create-account">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
