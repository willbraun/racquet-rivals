<script lang="ts">
	import { goto } from '$app/navigation'
	import EmailField from '$lib/EmailField.svelte'
	import PasswordField from '$lib/PasswordField.svelte'
	import FormError from '$lib/FormError.svelte'
	import { makeSetType } from '$lib/utils.js'
	import { enhance } from '$app/forms'
	import type { AuthResult } from '$lib/types'

	let username = ''
	let email = ''
	let showEmailValidation = false
	let password = ''
	let error = ''
	let loading = false

	$: disabled = !username || !email || password.length < 8 || loading || showEmailValidation

	const setType = makeSetType<AuthResult>()
</script>

<div class="mt-12 m-auto p-4 max-w-md">
	<h1 class="text-3xl mb-4">Create Account</h1>
	<form
		method="POST"
		use:enhance={() => {
			loading = true
			error = ''
			return async ({ result, update }) => {
				await update()
				const typedResult = setType(result)
				if (result.status === 200) {
					goto('/')
				} else {
					error = typedResult.data.error
				}
				loading = false
			}
		}}
	>
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
