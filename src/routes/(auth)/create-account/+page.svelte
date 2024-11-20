<script lang="ts">
	import { goto } from '$app/navigation'
	import EmailField from '$lib/components/EmailField.svelte'
	import PasswordField from '$lib/components/PasswordField.svelte'
	import FormError from '$lib/components/FormError.svelte'
	import { makeSetType } from '$lib/utils.js'
	import { enhance } from '$app/forms'
	import type { AuthResult } from '$lib/types'

	let username = $state('')
	let email = $state('')
	let showEmailValidation = $state(false)
	let password = $state('')
	let error = $state('')
	let loading = $state(false)

	let disabled = $derived(
		!username || !email || password.length < 8 || loading || showEmailValidation
	)

	const setType = makeSetType<AuthResult>()
</script>

<main class="absolute top-0 h-screen w-full bg-white md:bg-stone-100">
	<div class="mx-auto mt-24 max-w-md rounded-xl p-4 md:bg-white md:p-8 md:shadow-xl">
		<h1 class="mb-4 text-4xl font-semibold">Create Account</h1>
		<form
			method="POST"
			use:enhance={() => {
				loading = true
				error = ''
				return async ({ result, update }) => {
					await update()
					const typedResult = setType(result)
					if (result.status === 200) {
						goto(sessionStorage.getItem('loginGoto') || '/')
					} else {
						error = typedResult.data.error
					}
					loading = false
				}
			}}
		>
			<label class="label mb-4">
				<p>Username</p>
				<input
					class="input rounded-md"
					type="text"
					name="username"
					data-testid="UsernameField"
					bind:value={username}
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
	</div>
</main>
