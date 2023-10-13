<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { goto } from '$app/navigation'
	import { errorMessage } from '$lib/utils'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let username = ''
	let email = ''
	let password = ''
	let confirmPassword = ''
	let error = ''
	let loading = false

	const handleRegister = async () => {
		loading = true
		error = ''

		// try {
		// 	await pb.collection('user').authWithPassword(usernameOrEmail, password)
		// 	goto('/')
		// } catch (e) {
		// 	error = errorMessage(e)
		// }

		loading = false
	}
</script>

<div class="mt-12 m-auto p-4 max-w-md [&>*]:mb-4">
	<h1 class="text-3xl">Create Account</h1>
	<label class="label">
		<span>Username</span>
		<input class="input" type="text" bind:value={username} />
	</label>
	<label class="label">
		<span>Email</span>
		<input class="input" type="text" bind:value={email} />
	</label>
	<label class="label">
		<span>Password</span>
		<input class="input" type="password" bind:value={password} />
	</label>
	<label class="label">
		<span>Confirm Password</span>
		<input class="input" type="password" bind:value={confirmPassword} />
	</label>

	<div class="flex justify-center">
		<button
			type="button"
			class="btn variant-filled w-1/2 mt-4 mx-auto text-xl font-semibold"
			disabled={loading}
			on:click={handleRegister}
		>
			{loading ? 'Creating Account...' : 'Create Account'}
		</button>
	</div>

	<p class="text-sm text-red-500">{error}</p>

	<div class="mt-6">
		<p>Already have an account? Login <a class="underline" href="/login">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
