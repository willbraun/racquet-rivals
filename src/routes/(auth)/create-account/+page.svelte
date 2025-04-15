<script lang="ts">
	import { pb } from '$lib/pocketbase'
	import EmailField from '$lib/components/EmailField.svelte'
	import PasswordField from '$lib/components/PasswordField.svelte'
	import FormError from '$lib/components/FormError.svelte'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { loginGoto } from '$lib/store'
	import AuthBase from '../AuthBase.svelte'
	import { errorMessage } from '$lib/utils'

	let username = $state('')
	let email = $state('')
	let showEmailValidation = $state(false)
	let password = $state('')
	let error = $state('')
	let loading = $state(false)

	let disabled = $derived(
		!username || !email || password.length < 8 || loading || showEmailValidation
	)

	let usernameRef: HTMLInputElement | null = $state(null)
	let selectedPlan: string | null = $state(null)
	onMount(() => {
		if (usernameRef) {
			usernameRef.focus()
		}
		selectedPlan = sessionStorage.getItem('selectedPlan')
	})

	const handleCreateAccount = async (event: Event) => {
		event.preventDefault()
		loading = true
		error = ''

		let clientError = ''

		if (username === '') {
			clientError = 'Please enter your username\n'
		}

		if (email === '') {
			clientError += 'Please enter your email\n'
		}

		if (password === '') {
			clientError += 'Please enter your password'
		}

		if (clientError) {
			error = clientError
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
			await pb.collection('user').authWithPassword(email, password)

			error = ''

			const selectedPlan = sessionStorage.getItem('selectedPlan')
			const redirectUrl = selectedPlan ? `/pricing?selectedPlan=${selectedPlan}` : $loginGoto
			goto(redirectUrl)
		} catch (err) {
			error = errorMessage(err)
		} finally {
			loading = false
		}
	}
</script>

<AuthBase>
	<h1 class="mb-8 text-4xl font-semibold">Create Account</h1>
	{#if selectedPlan}
		<!-- TODO - update with a better message and styling, and add to login page too -->
		<p class="mb-4 text-center text-2xl font-semibold">
			You are signing up for the {selectedPlan} plan
		</p>
	{/if}
	<form onsubmit={handleCreateAccount}>
		<label class="label mb-4">
			<p>Username</p>
			<input
				class="input rounded-md"
				type="text"
				name="username"
				data-testid="UsernameField"
				bind:value={username}
				bind:this={usernameRef}
			/>
		</label>
		<EmailField bind:email bind:showValidation={showEmailValidation} />
		<PasswordField bind:password />
		<p class="text-xs text-gray-500">Must be at least 8 characters</p>

		<div class="flex justify-center">
			<button
				type="submit"
				class="variant-filled-primary btn mx-auto mt-4 w-1/2 rounded-xl text-xl font-semibold"
				{disabled}
			>
				{loading ? 'Creating Account...' : 'Create Account'}
			</button>
		</div>
	</form>
	<div class="mt-2">
		<FormError {error} />
	</div>
	<div class="mt-6">
		<p>Already have an account? Login <a class="underline" href="/login">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</AuthBase>
