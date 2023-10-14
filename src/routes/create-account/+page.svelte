<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { goto } from '$app/navigation'
	import { errorMessage } from '$lib/utils'
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	let username = ''
	let email = ''
	let password = ''
	let error = ''
	let show = false
	let loading = false

	const toggleShow = () => (show = !show)

	const handleRegister = async () => {
		loading = true
		error = ''

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
			goto('/')
		} catch (e) {
			error = errorMessage(e)
		}

		loading = false
	}
</script>

<div class="mt-12 m-auto p-4 max-w-md [&>*]:mb-4">
	<h1 class="text-3xl">Create Account</h1>
	<label class="label">
		<span>Username</span>
		<input class="input" type="text" bind:value={username} />
	</label>
	<label class="label">
		<span>Email</span>
		<input class="input" type="text" bind:value={email} />
	</label>
	<label class="label">
		<span>Password</span>
		<div class="relative">
			<input
				class="input"
				type={show ? 'text' : 'password'}
				on:input={(e) => (password = e.currentTarget.value)}
			/>
			<button
				type="button"
				class="btn btn-sm variant-ghost w-14 absolute right-1.5 top-1/2 -translate-y-1/2"
				on:click={toggleShow}
			>
				{show ? 'Hide' : 'Show'}
			</button>
		</div>
	</label>

	<div class="flex justify-center">
		<button
			type="button"
			class="btn variant-filled w-1/2 mt-4 mx-auto text-xl font-semibold"
			disabled={loading}
			on:click={handleRegister}
		>
			{loading ? 'Creating Account...' : 'Create Account'}
		</button>
	</div>

	<p class="text-sm text-red-500 whitespace-pre-line">{error}</p>

	<div class="mt-6">
		<p>Already have an account? Login <a class="underline" href="/login">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
