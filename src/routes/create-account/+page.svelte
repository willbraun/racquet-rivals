<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { goto } from '$app/navigation'
	import { errorMessage } from '$lib/utils'
	import EmailField from '$lib/EmailField.svelte'
	import PasswordField from '$lib/PasswordField.svelte'
	import FormError from '$lib/FormError.svelte'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let username = ''
	let email = ''
	let showEmailValidation = false
	let password = ''
	let error = ''
	let loading = false

	$: disabled = !username || !email || password.length < 8 || loading || showEmailValidation

	const handleRegister = async () => {
		loading = true
		error = ''

		const data = {
			username,
			email,
			emailVisibility: true,
			password,
			passwordConfirm: password
		}

		try {
			await pb.collection('user').create(data)
			await pb.collection('user').authWithPassword(email, password)
			goto('/')
		} catch (e) {
			error = errorMessage(e)
		}

		loading = false
	}
</script>

<div class="mt-12 m-auto p-4 max-w-md">
	<h1 class="text-3xl mb-4">Create Account</h1>
	<form on:submit={handleRegister}>
		<label class="label mb-4">
			<p>Username</p>
			<input class="input rounded-md" type="text" bind:value={username} />
		</label>
		<EmailField bind:email bind:showValidation={showEmailValidation} />
		<PasswordField bind:password />
		<p class="text-xs text-gray-500">Must be at least 8 characters</p>

		<div class="flex justify-center">
			<button
				type="submit"
				class="btn variant-filled w-1/2 mt-4 mx-auto rounded-xl text-xl font-semibold"
				{disabled}
			>
				{loading ? 'Creating Account...' : 'Create Account'}
			</button>
		</div>
	</form>

	<FormError bind:error />

	<div class="mt-6">
		<p>Already have an account? Login <a class="underline" href="/login">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
