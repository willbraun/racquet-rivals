<script lang="ts">
	import Pocketbase from 'pocketbase'
	import EmailField from '$lib/EmailField.svelte'
	import FormError from '$lib/FormError.svelte'
	import { errorMessage, makeSetType } from '$lib/utils.js'
	import { enhance } from '$app/forms'
	import type { AuthResult } from '$lib/types'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let email = ''
	let showEmailValidation = false
	let error = ''
	let loading = false
	let success = false
	let buttonRef: HTMLButtonElement

	$: disabled = loading || showEmailValidation
	$: if (buttonRef && !showEmailValidation) {
		buttonRef.disabled = false
		buttonRef.focus()
	}

	const setType = makeSetType<AuthResult>()
</script>

<div class="mt-12 m-auto p-4 max-w-md">
	<h1 class="text-3xl mb-4">Reset Password</h1>
	<p class="mb-4">Enter your email and we'll send you a link to reset your password</p>
	<form
		method="POST"
		use:enhance={() => {
			loading = true
			error = ''
			return async ({ result, update }) => {
				await update()
				const typedResult = setType(result)
				if (result.status === 200) {
					success = true
				} else {
					success = false
					error = typedResult.data.error
				}
				loading = false
			}
		}}
	>
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
	<div class="mt-2">
		<FormError bind:error />
	</div>
	<div class="mt-6">
		<p><a class="underline" href="/login">Back to Login</a></p>
		<p>Don't have an account? Create one <a class="underline" href="/create-account">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
