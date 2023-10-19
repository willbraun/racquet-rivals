<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { errorMessage } from '$lib/utils'
	import EmailField from '$lib/EmailField.svelte'
	import FormError from '$lib/FormError.svelte'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let email = ''
	let showEmailValidation = false
	let error = ''
	let loading = false
	let success = true
	let buttonRef: HTMLButtonElement

	$: disabled = loading || showEmailValidation
	$: if (buttonRef && !showEmailValidation) {
		buttonRef.disabled = false
		buttonRef.focus()
	}

	const handleResetPassword = async () => {
		loading = true
		error = ''

		try {
			await pb.collection('user').requestPasswordReset(email)
			success = true
		} catch (e) {
			error = errorMessage(e)
		}

		loading = false
	}
</script>

<div class="mt-12 m-auto p-4 max-w-md">
	<h1 class="text-3xl mb-4">Reset Password</h1>
	<p class="mb-4">Enter your email and we'll send you a link to reset your password</p>
	<form on:submit={handleResetPassword}>
		<EmailField bind:email bind:showValidation={showEmailValidation} />
		<div class="flex justify-center">
			<button
				type="submit"
				class="btn variant-filled w-2/3 my-4 mx-auto rounded-xl text-xl font-semibold"
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

	<FormError bind:error />

	<div class="mt-6">
		<p><a class="underline" href="/login">Back to Login</a></p>
		<p>Don't have an account? Create one <a class="underline" href="/create-account">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
