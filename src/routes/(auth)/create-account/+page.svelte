<script lang="ts">
	import { pb } from '$lib/pocketbase'
	import EmailField from '$lib/components/EmailField.svelte'
	import PasswordField from '$lib/components/PasswordField.svelte'
	import FormError from '$lib/components/FormError.svelte'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { loginGoto } from '$lib/store'
	import AuthBase from '../AuthBase.svelte'
	import { errorMessage } from '$lib/utils'
	import type { SelectedPlan } from '$lib/types'
	import x from '$lib/images/icons/x.svg'

	let username = $state('')
	let email = $state('')
	let showEmailValidation = $state(false)
	let password = $state('')
	let error = $state('')
	let loading = $state(false)

	let disabled = $derived(
		!username || !email || password.length < 8 || loading || showEmailValidation
	)

	let usernameRef: HTMLInputElement | null = $state(null)
	let selectedPlan: SelectedPlan | null = $state(null)
	let redirectCanceled = $state(false)
	onMount(() => {
		if (usernameRef) {
			usernameRef.focus()
		}
		const selectedPlanStr = sessionStorage.getItem('selectedPlan')
		selectedPlan = selectedPlanStr ? JSON.parse(selectedPlanStr) : null
	})

	const handleCreateAccount = async (event: Event) => {
		event.preventDefault()
		loading = true
		error = ''

		let clientError = ''

		if (username === '') {
			clientError = 'Please enter your username\n'
		}

		if (email === '') {
			clientError += 'Please enter your email\n'
		}

		if (password === '') {
			clientError += 'Please enter your password'
		}

		if (clientError) {
			error = clientError
			loading = false
			return
		}

		const data = {
			username,
			email,
			emailVisibility: true,
			password,
			passwordConfirm: password
		}

		try {
			await pb.collection('user').create(data)
			await pb.collection('user').authWithPassword(email, password)

			error = ''

			sessionStorage.removeItem('selectedPlan')

			const redirectUrl =
				selectedPlan && !redirectCanceled
					? `/pricing?selectedPlan=${selectedPlan.plan}`
					: $loginGoto
			goto(redirectUrl)
		} catch (err) {
			error = errorMessage(err)
		} finally {
			loading = false
		}
	}
</script>

<AuthBase>
	<h1 class="mb-8 text-4xl font-bold">Create Account</h1>
	<form onsubmit={handleCreateAccount}>
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
		{#if selectedPlan}
			<div class="mt-8 flex items-center justify-center gap-4 rounded-lg bg-primary-50 p-4">
				{#if redirectCanceled}
					<p class="text-muted-foreground text-center text-sm">
						Redirect canceled.
						<button
							type="button"
							class="hover:text-foreground ml-2 underline underline-offset-2"
							onclick={() => (redirectCanceled = false)}
						>
							Undo
						</button>
					</p>
				{:else}
					<p class="text-center text-sm">
						You'll be redirected to complete your purchase for <span class="font-bold"
							>{selectedPlan?.title}</span
						> after creating an account.
					</p>
					<button
						type="button"
						class="text-muted-foreground text-sm underline underline-offset-2"
						onclick={() => (redirectCanceled = true)}
					>
						<img src={x} alt="cancel redirect to pricing page" class="inline w-6" />
					</button>
				{/if}
			</div>
		{/if}
	</form>
	<div class="mt-2">
		<FormError {error} />
	</div>
	<div class="mt-6">
		<p>Already have an account? Login <a class="underline" href="/login">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</AuthBase>
