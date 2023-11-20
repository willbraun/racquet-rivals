<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { goto } from '$app/navigation'
	import EmailField from '$lib/EmailField.svelte'
	import PasswordField from '$lib/PasswordField.svelte'
	import FormError from '$lib/FormError.svelte'
	import { errorMessage, mainColor } from '$lib/utils.js'
	import Cookies from 'js-cookie'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let username = ''
	let email = ''
	let showEmailValidation = false
	let password = ''
	let error = ''
	let loading = false

	$: disabled = !username || !email || password.length < 8 || loading || showEmailValidation

	const register = async () => {
		loading = true

		if (username === '') {
			error = 'Please enter your username\n'
		}

		if (email === '') {
			error += 'Please enter your email\n'
		}

		if (password === '') {
			error += 'Please enter your password'
		}

		if (error) {
			loading = false
			return
		}

		const data = {
			username,
			email,
			emailVisibility: true,
			password,
			passwordConfirm: password
		}

		try {
			await pb.collection('user').create(data)
			const authResponse = await pb.collection('user').authWithPassword(email, password)
			Cookies.set(
				'currentUser',
				JSON.stringify({
					id: authResponse.record.id,
					username: authResponse.record.username,
					color: mainColor
				}),
				{ expires: 7 }
			)
			Cookies.set('pb_auth', 'true', { expires: 7 })
			goto('/')
		} catch (e) {
			error = errorMessage(e)
		}
	}
</script>

<div class="mt-12 m-auto p-4 max-w-md">
	<h1 class="text-3xl mb-4">Create Account</h1>
	<form on:submit={register}>
		<label class="label mb-4">
			<p>Username</p>
			<input class="input rounded-md" type="text" name="username" bind:value={username} />
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
	<div class="mt-2">
		<FormError bind:error />
	</div>
	<div class="mt-6">
		<p>Already have an account? Login <a class="underline" href="/login">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
