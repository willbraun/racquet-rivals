<script lang="ts">
	import EmailField from '$lib/components/EmailField.svelte'
	import FormError from '$lib/components/FormError.svelte'
	import { onMount } from 'svelte'
	import AuthBase from '../AuthBase.svelte'
	import { pb } from '$lib/pocketbase'
	import { errorMessage } from '$lib/utils'

	let email = $state('')
	let showEmailValidation = $state(false)
	let error = $state('')
	let loading = $state(false)
	let success = $state(false)
	let disabled = $derived(loading || showEmailValidation)

	let emailRef: HTMLInputElement | null = $state(null)
	onMount(() => {
		if (emailRef) {
			emailRef.focus()
		}
	})

	// focus on the button after correcting email format and tabbing
	let buttonRef: HTMLButtonElement | null = $state(null)
	$effect(() => {
		if (buttonRef && !showEmailValidation) {
			buttonRef.disabled = false
			buttonRef.focus()
		}
	})

	const handleResetPassword = async (event: Event) => {
		event.preventDefault()
		loading = true
		error = ''
		success = false

		if (email === '') {
			error = 'Please enter your email'
			loading = false
			return
		}

		try {
			await pb.collection('user').requestPasswordReset(email)
			success = true
			error = ''
		} catch (err) {
			error = errorMessage(err)
		} finally {
			loading = false
		}
	}
</script>

<AuthBase>
	<h1 class="mb-8 text-4xl font-semibold">Reset Password</h1>
	<p class="mb-4">Enter your email and we'll send you a link to reset your password</p>
	<form method="POST" onsubmit={handleResetPassword}>
		<EmailField bind:email bind:showValidation={showEmailValidation} bind:ref={emailRef} />
		<div class="flex justify-center">
			<button
				type="submit"
				class="variant-filled-primary btn mx-auto my-4 rounded-xl text-xl font-semibold"
				{disabled}
				bind:this={buttonRef}
			>
				{loading ? 'Sending...' : 'Send password reset link'}
			</button>
		</div>
	</form>

	{#if success}
		<p class="text-center">
			Sent! Please check your email and spam folder for your password reset link
		</p>
	{/if}
	<div class="mt-2">
		<FormError {error} />
	</div>
	<div class="mt-6">
		<p><a class="underline" href="/login">Back to Login</a></p>
		<p>Don't have an account? Create one <a class="underline" href="/create-account">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</AuthBase>
