<script lang="ts">
	import { goto } from '$app/navigation'
	import FormError from '$lib/components/FormError.svelte'
	import PasswordField from '$lib/components/PasswordField.svelte'
	import { pb } from '$lib/pocketbase'
	import { loginGoto } from '$lib/store'
	import { errorMessage } from '$lib/utils'
	import { onMount } from 'svelte'
	import AuthBase from '../AuthBase.svelte'

	let usernameOrEmail = $state('')
	let password = $state('')
	let error = $state('')
	let loading = $state(false)
	let rememberMe = $state(false)
	let usernameOrEmailRef: HTMLInputElement | null = $state(null)
	let passwordRef: HTMLInputElement | null = $state(null)

	interface RememberLogin {
		usernameOrEmail: string
		rememberMe: boolean
	}

	const toggle = () => {
		rememberMe = !rememberMe
	}

	onMount(() => {
		// Handle remembered login info
		const saved: RememberLogin = JSON.parse(localStorage.getItem('rememberLogin') || '{}')
		if (saved.rememberMe) {
			usernameOrEmail = saved.usernameOrEmail
			rememberMe = true
		}

		// Handle input focus
		if (usernameOrEmailRef && passwordRef) {
			if (rememberMe) {
				passwordRef.focus()
			} else {
				usernameOrEmailRef.focus()
			}
		}
	})

	const handleLogin = async (event: Event) => {
		event.preventDefault()
		loading = true
		error = ''

		let clientError = ''

		if (usernameOrEmail === '') {
			clientError = 'Please enter your username or email\n'
		}

		if (password === '') {
			clientError += 'Please enter your password'
		}

		if (clientError) {
			error = clientError
			loading = false
			return
		}

		try {
			await pb.collection('user').authWithPassword(usernameOrEmail, password)

			localStorage.setItem(
				'rememberLogin',
				JSON.stringify({
					rememberMe,
					usernameOrEmail
				})
			)

			error = ''

			goto($loginGoto)
		} catch (err) {
			error = errorMessage(err)
		} finally {
			loading = false
		}
	}
</script>

<AuthBase>
	<h1 class="mb-8 text-4xl font-bold">Login</h1>
	<form class="*:mb-4" onsubmit={handleLogin}>
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
			<label class="mt-4 flex items-center space-x-2">
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
			<a class="text-sm text-gray-500" href="/reset-password">Forgot password?</a>
		</div>
		<div class="flex justify-center">
			<button
				type="submit"
				class="preset-filled-primary-500 btn mx-auto mt-4 w-1/2 rounded-xl text-xl font-semibold"
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
