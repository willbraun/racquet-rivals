<script lang="ts">
	import { goto } from '$app/navigation'
	import PasswordField from '$lib/PasswordField.svelte'
	import { persisted } from 'svelte-persisted-store'
	import { get } from 'svelte/store'
	import FormError from '$lib/FormError.svelte'
	import { makeSetType } from '$lib/utils'
	import { enhance } from '$app/forms'
	import type { AuthResult } from '$lib/types'

	let usernameOrEmail = ''
	let password = ''
	let error = ''
	let loading = false
	let rememberMe = false

	const setType = makeSetType<AuthResult>()

	const rememberLogin = persisted('rememberLogin', {
		rememberMe: false,
		usernameOrEmail: ''
	})

	const saved = get(rememberLogin)
	if (saved.rememberMe) {
		usernameOrEmail = saved.usernameOrEmail
		rememberMe = true
	}
</script>

<main class="w-full h-screen bg-white">
	<div class="pt-24 px-4 max-w-md mx-auto">
		<h1 class="text-4xl mb-4">Login</h1>
		<form
			method="POST"
			class="[&>*]:mb-4"
			use:enhance={() => {
				loading = true
				error = ''
				return async ({ result, update }) => {
					await update()
					const typedResult = setType(result)
					if (result.status === 200) {
						rememberLogin.set({
							rememberMe,
							usernameOrEmail
						})
						goto(sessionStorage.getItem('loginGoto') || '/')
					} else {
						error = typedResult.data.error
					}
					loading = false
				}
			}}
		>
			<label class="label">
				<p>Username or email</p>
				<input
					class="input rounded-md"
					type="text"
					name="usernameOrEmail"
					data-testid="UsernameOrEmailField"
					bind:value={usernameOrEmail}
				/>
			</label>
			<PasswordField bind:password />
			<div class="flex justify-between">
				<label class="flex items-center space-x-2">
					<input class="checkbox" type="checkbox" bind:checked={rememberMe} />
					<p>Remember me</p>
				</label>
				<a class="text-sm text-gray-500 -translate-y-4" href="/reset-password">Forgot password?</a>
			</div>
			<div class="flex justify-center">
				<button
					type="submit"
					class="btn variant-filled-primary w-1/2 mt-4 mx-auto rounded-xl text-xl font-semibold"
					disabled={loading}
				>
					{loading ? 'Logging in...' : 'Log in'}
				</button>
			</div>
		</form>

		<FormError bind:error />

		<div class="mt-6">
			<p>Don't have an account? Create one <a class="underline" href="/create-account">here</a></p>
			<p><a class="underline" href="/">Home</a></p>
		</div>
	</div>
</main>
