<script lang="ts">
	import PasswordField from '$lib/components/PasswordField.svelte'
	import FormError from '$lib/components/FormError.svelte'
	import { makeSetType } from '$lib/utils'
	import { enhance } from '$app/forms'
	import type { AuthResult } from '$lib/types'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { loginGoto } from '$lib/store'
	import AuthBase from '../AuthBase.svelte'

	let usernameOrEmail = $state('')
	let password = $state('')
	let error = $state('')
	let loading = $state(false)
	let rememberMe = $state(false)

	interface RememberLogin {
		usernameOrEmail: string
		rememberMe: boolean
	}

	const toggle = () => {
		rememberMe = !rememberMe
	}

	onMount(() => {
		const saved: RememberLogin = JSON.parse(localStorage.getItem('rememberLogin') || '{}')
		if (saved.rememberMe) {
			usernameOrEmail = saved.usernameOrEmail
			rememberMe = true
		}
	})

	let usernameOrEmailRef: HTMLInputElement | null = $state(null)
	let passwordRef: HTMLInputElement | null = $state(null)
	onMount(() => {
		if (!usernameOrEmailRef || !passwordRef) return

		if (rememberMe) {
			passwordRef.focus()
		} else {
			usernameOrEmailRef.focus()
		}
	})

	const setType = makeSetType<AuthResult>()
</script>

<AuthBase>
	<h1 class="mb-4 text-4xl font-semibold">Login</h1>
	<form
		method="POST"
		class="[&>*]:mb-4"
		use:enhance={() => {
			loading = true
			error = ''
			const afterSuccessRememberLogin = {
				rememberMe,
				usernameOrEmail
			}
			return async ({ result, update }) => {
				await update()
				const typedResult = setType(result)
				if (result.status === 200) {
					localStorage.setItem('rememberLogin', JSON.stringify(afterSuccessRememberLogin))
					goto($loginGoto)
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
				bind:this={usernameOrEmailRef}
			/>
		</label>
		<PasswordField bind:password bind:ref={passwordRef} />
		<div class="flex justify-between">
			<label class="flex items-center space-x-2">
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={rememberMe}
					onclick={toggle}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault()
							toggle()
						}
					}}
				/>
				<p>Remember me</p>
			</label>
			<a class="-translate-y-4 text-sm text-gray-500" href="/reset-password">Forgot password?</a>
		</div>
		<div class="flex justify-center">
			<button
				type="submit"
				class="variant-filled-primary btn mx-auto mt-4 w-1/2 rounded-xl text-xl font-semibold"
				disabled={loading}
			>
				{loading ? 'Logging in...' : 'Log in'}
			</button>
		</div>
	</form>

	<FormError {error} />

	<div class="mt-6">
		<p>Don't have an account? Create one <a class="underline" href="/create-account">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</AuthBase>
