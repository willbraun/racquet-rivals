<script lang="ts">
	import { errorMessage } from '$lib/utils.js'
	import Pocketbase from 'pocketbase'
	export let data
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	const title = `${data.draw.name} ${data.draw.event} ${data.draw.year}`
	const fullDrawRounds = Math.log2(data.draw.size)
	const ourRounds = [...Array(fullDrawRounds + 1).keys()].map((x) => x + 1).slice(-5)
	const slots = data.slots.items.filter((slot) => slot.round >= fullDrawRounds - 3)
</script>

<header class="flex justify-end items-center gap-2 p-2">
	<p class="flex-grow text-xl font-bold ml-4">Tennis Bracket</p>
	{#if pb.authStore.isValid}
		<a data-sveltekit-reload href="/">
			<button
				type="button"
				class="btn variant-ghost rounded-xl"
				on:click={() => {
					try {
						pb.authStore.clear()
					} catch (e) {
						errorMessage(e)
					}
				}}>Logout</button
			>
		</a>
	{:else}
		<a href="/login">
			<button type="button" class="btn variant-ghost rounded-xl">Login</button>
		</a>
		<a href="/create-account">
			<button type="button" class="btn variant-filled rounded-xl">Sign up</button>
		</a>
	{/if}
</header>

<h1 class="text-2xl">{title}</h1>

<div class="grid grid-cols-5">
	<!-- Header Row -->
	<div class="border text-center">Round of 16</div>
	<div class="border text-center">Quarterfinals</div>
	<div class="border text-center">Semifinals</div>
	<div class="border text-center">Final</div>
	<div class="border text-center">Champion</div>

	{#each ourRounds as round, index}
		<div class="column">
			<div class="bg-blue-500" style="height: {2 ** index * 2}rem" />
			{#each slots.filter((slot) => slot.round === round) as slot}
				<div
					class="flex justify-center items-center border-b-2 border-black text-center"
					style="height: {2 ** index * 4}rem"
				>
					{slot.name}
				</div>
			{/each}
			<div class="bg-red-500" style="height: {2 ** index * 2}rem" />
		</div>
	{/each}

	<!-- Round 1 -->
	<div class="">
		<div class="border-b-2 border-black text-center">
			<div class="pt-2">Team A</div>
		</div>
		<div class="border-b-2 border-r-2 border-black text-center">
			<div class="pt-2">Team B</div>
		</div>
		<div class="border-b-2 border-black text-center">
			<div class="pt-2">Team C</div>
		</div>
		<div class="border-b-2 border-r-2 border-black text-center">
			<div class="pt-2">Team D</div>
		</div>
	</div>

	<!-- Round 2 -->
	<div class="">
		<div class="border-b-2 border-black text-center">
			<div class="pt-6">Winner 1</div>
		</div>
		<div class="border-b-2 border-r-2 border-black text-center">
			<div class="pt-11">Winner 2</div>
		</div>
	</div>

	<!-- Round 3 (Final) -->
	<div class="">
		<div class="border-b-2 border-black text-center">
			<div class="pt-16">Champion</div>
		</div>
	</div>
</div>
