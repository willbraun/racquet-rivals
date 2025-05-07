<script lang="ts">
	import EmailField from '$lib/components/EmailField.svelte'
	import FormError from '$lib/components/FormError.svelte'
	import { onMount } from 'svelte'
	import AuthBase from '../AuthBase.svelte'
	import { pb } from '$lib/pocketbase'
	import { errorMessage } from '$lib/utils'
	import { slide } from 'svelte/transition'

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

		if (email === '') {
			error = 'Please enter your email'
			success = false
			loading = false
			return
		}

		const trimmedEmail = email.trim()

		try {
			await pb.collection('user').requestPasswordReset(trimmedEmail)
			success = true
			error = ''
		} catch (err) {
			success = false
			error = errorMessage(err)
		} finally {
			loading = false
		}
	}
</script>

<AuthBase>
	<h1 class="mb-8 text-4xl font-bold">Reset Password</h1>
	<p class="mb-4">Enter your email and we'll send you a link to reset your password</p>
	<form onsubmit={handleResetPassword}>
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
		<div class="relative my-4 overflow-hidden rounded-md bg-green-100">
			<div
				class="p-4 text-center text-green-900"
				transition:slide={{ duration: 300, axis: 'y', easing: (t) => t * (2 - t) }}
			>
				Sent! Please check your email and spam folder for your password reset link.
			</div>
			<!-- Gradient overlay for blur effect -->
			<div
				class="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-100 to-transparent"
			></div>
		</div>
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
