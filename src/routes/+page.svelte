<script lang="ts">
	import Pocketbase from 'pocketbase';
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev');

	const isAuth = !!pb.authStore.token;
</script>

<h1>Home</h1>

<p>{isAuth}</p>

{#if isAuth}
	<button type="button" on:click={pb.authStore.clear}>Logout</button>
{:else}
	<a href="/login">Login</a>
{/if}
