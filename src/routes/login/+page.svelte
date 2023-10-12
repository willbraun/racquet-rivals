<script lang="ts">
	import Pocketbase from 'pocketbase';
	import { goto } from '$app/navigation';
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev');

	let usernameOrEmail = '';
	let password = '';
	let error = '';

	const postAuth = async () => {
		const authData = await pb.collection('user').authWithPassword(usernameOrEmail, password);
		console.log(authData);

		if (authData.token) {
			goto('/');
		} else {
			console.log('auth failed');
			// show error message on screen
		}
	};
</script>

<div class="mt-12 m-auto p-4 max-w-md [&>*]:mb-4">
	<h1 class="text-3xl">Login</h1>
	<label class="label">
		<span>Username or email</span>
		<input class="input" type="text" on:input={(e) => (usernameOrEmail = e.currentTarget.value)} />
	</label>
	<label class="label">
		<span>Password</span>
		<input class="input" type="password" on:input={(e) => (password = e.currentTarget.value)} />
	</label>

	<div class="flex justify-center">
		<button
			type="button"
			class="btn variant-filled w-1/2 mt-4 mx-auto text-xl font-semibold"
			on:click={postAuth}
		>
			Log in
		</button>
	</div>

	<p>{error}</p>

	<div class="mt-6">
		<p>Don't have an account? Create one <a class="underline" href="/create-account">here</a></p>
		<p><a class="underline" href="/">Home</a></p>
	</div>
</div>
