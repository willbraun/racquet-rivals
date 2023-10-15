<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { goto } from '$app/navigation'
	import { errorMessage, isValidEmail } from '$lib/utils'
	import PasswordField from '$lib/PasswordField.svelte'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let username = ''
	let email = ''
	let showValidation = false
	let password = ''
	let error = ''
	let loading = false

	const handleEmailValidation = () => {
		if (email === '') {
			showValidation = false
			return
		}
		showValidation = !isValidEmail(email)
	}

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
		<label class="label">
			<p>Email</p>
			<input
				class="input rounded-md"
				type="text"
				class:input-error={showValidation}
				bind:value={email}
				on:change={handleEmailValidation}
			/>
		</label>
		<p class="text-red-500 text-xs my-0" class:invisible={!showValidation}>
			Please enter an email address with a valid format
		</p>
		<PasswordField bind:password />
		<p class="text-xs text-gray-500">Must be at least 8 characters</p>

		<div class="flex justify-center">
			<button
				type="submit"
				class="btn variant-filled w-1/2 mt-4 mx-auto rounded-xl text-xl font-semibold"
				disabled={loading}
			>
				{loading ? 'Creating Account...' : 'Create Account'}
			</button>
		</div>
	</form>

	<p class="text-sm text-red-500 whitespace-pre-line mt-2">{error}</p>

	<div class="mt-6">
		<p>Already have an account? Login <a class="underline" href="/login">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
