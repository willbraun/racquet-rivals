<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { goto } from '$app/navigation'
	import PasswordField from '$lib/PasswordField.svelte'
	import { localStorageStore } from '@skeletonlabs/skeleton'
	import { get, type Writable } from 'svelte/store'
	import FormError from '$lib/FormError.svelte'
	import { enhance } from '$app/forms'
	export let form

	let usernameOrEmail = ''
	let password = ''
	let error = ''
	let loading = false
	let rememberMe = false

	$: error = form?.error ?? ''

	type RememberLogin = {
		rememberMe: boolean
		usernameOrEmail: string
	}

	const rememberLogin: Writable<RememberLogin> = localStorageStore('rememberLogin', {
		rememberMe: false,
		usernameOrEmail: ''
	})

	const saved = get(rememberLogin)
	if (saved.rememberMe) {
		usernameOrEmail = saved.usernameOrEmail
		rememberMe = true
	}
</script>

<div class="mt-12 m-auto p-4 max-w-md">
	<h1 class="text-3xl mb-4">Login</h1>
	<form
		method="POST"
		action="?/login"
		class="[&>*]:mb-4"
		use:enhance={() => {
			loading = true
			error = ''
			return async ({ result, update }) => {
				await update()
				if (result.status === 200) {
					rememberLogin.set({
						rememberMe,
						usernameOrEmail
					})
					goto('/')
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
				class="btn variant-filled w-1/2 mt-4 mx-auto rounded-xl text-xl font-semibold"
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
