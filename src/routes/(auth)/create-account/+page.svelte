<script lang="ts">
	import { dev } from '$app/environment'
	import { enhance } from '$app/forms'
	import { PUBLIC_CF_TURNSTILE_SITE_KEY } from '$env/static/public'
	import EmailField from '$lib/components/EmailField.svelte'
	import FormError from '$lib/components/FormError.svelte'
	import PasswordField from '$lib/components/PasswordField.svelte'
	import { loginGoto } from '$lib/store'
	import { onDestroy, onMount } from 'svelte'
	import Honeypot from '../../../lib/components/Honeypot.svelte'
	import { logErrorInDev } from '../../../lib/utils'
	import AuthBase from '../AuthBase.svelte'
	import type { ActionData } from './$types'

	interface Props {
		form: ActionData
	}

	let { form }: Props = $props()

	let username = $state('')
	let email = $state('')
	let showEmailValidation = $state(false)
	let password = $state('')
	let honeypot = $state('')
	let cfChallengeToken = $state('')
	let error = $state('')
	let loading = $state(false)

	let disabled = $derived(
		!username ||
			!email ||
			password.length < 8 ||
			!cfChallengeToken ||
			loading ||
			showEmailValidation
	)

	let usernameRef: HTMLInputElement | null = $state(null)
	let widgetId: string
	onMount(() => {
		if (usernameRef) {
			usernameRef.focus()
			widgetId = window.turnstile.render('#turnstile-container', {
				sitekey: dev ? '1x00000000000000000000AA' : PUBLIC_CF_TURNSTILE_SITE_KEY,
				callback: (t: string) => {
					cfChallengeToken = t
					error = ''
				},
				'error-callback': (errorCode: number) => {
					logErrorInDev('Turnstile error occurred:', errorCode)
					handleTurnstileError(errorCode)
					return true // Indicates we handled the error
				}
			})
		}
	})

	onDestroy(() => window.turnstile.remove(widgetId))

	const handleTurnstileError = (errorCode: number) => {
		const errorFamily = Math.floor(errorCode / 1000)

		switch (errorFamily) {
			case 100:
				error = 'Please refresh the page and try again.'
				break
			case 110:
				error = 'Configuration error. Please contact support.'
				break
			case 300:
			case 600:
				error = 'Security check failed. Please try refreshing or using a different browser.'
				break
			default:
				error = 'An unexpected error occurred. Please try again.'
		}
	}

	const handleEnhance = () => {
		let clientError = ''

		if (username === '') clientError += 'Please enter your username\n'
		if (email === '') clientError += 'Please enter your email\n'
		if (password === '') clientError += 'Please enter your password'

		if (clientError) {
			error = clientError
			return () => {}
		}

		loading = true
		error = ''

		return async ({
			result,
			update
		}: {
			result: { type: string; data?: { error?: string } }
			update: () => Promise<void>
		}) => {
			if (result.type === 'failure') {
				error = result.data?.error ?? 'Something went wrong'
				window.turnstile.reset(widgetId)
				cfChallengeToken = ''
			}
			loading = false
			await update()
		}
	}
</script>

<AuthBase>
	<h1 class="mb-8 text-4xl font-bold">Create Account</h1>
	<form method="POST" use:enhance={handleEnhance}>
		<label class="label mb-4">
			<p>Username</p>
			<input
				class="input rounded-md"
				type="text"
				name="username"
				data-testid="UsernameField"
				bind:value={username}
				bind:this={usernameRef}
			/>
		</label>
		<EmailField bind:email bind:showValidation={showEmailValidation} />
		<PasswordField bind:password />
		<Honeypot bind:value={honeypot} />
		<input type="hidden" name="cf_token" value={cfChallengeToken} />
		<input type="hidden" name="loginGoto" value={$loginGoto} />
		<p class="text-xs text-gray-500">Must be at least 8 characters</p>

		<div id="turnstile-container" class="mt-6"></div>

		<div class="mt-2 flex justify-center">
			<button
				type="submit"
				class="preset-filled-primary-500 btn mx-auto mt-4 w-fit rounded-xl px-4 text-xl font-semibold"
				data-testid="CreateAccountButton"
				{disabled}
			>
				{loading ? 'Creating Account...' : 'Create Account'}
			</button>
		</div>
	</form>
	<div class="mt-2">
		<FormError error={form?.error ?? error} />
	</div>
	<div class="mt-6">
		<p>Already have an account? Login <a class="underline" href="/login">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</AuthBase>
