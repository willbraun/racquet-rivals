<script lang="ts">
	import { errorMessage } from '$lib/utils.js'
	import Pocketbase from 'pocketbase'
	export let data
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	const title = `${data.draw.name} ${data.draw.event} ${data.draw.year}`
	const fullDrawRounds = Math.log2(data.draw.size)
	const ourRounds = [...Array(fullDrawRounds + 1).keys()].map((x) => x + 1).slice(-5)
	const slots = data.slots.items.filter((slot) => slot.round >= fullDrawRounds - 3)

	const getHeight = (roundIndex: number, position: number): number => {
		if (position === 1) {
			return 2 ** (roundIndex - 1) * 4 + 2
		} else {
			return 2 ** roundIndex * 4
		}
	}
</script>

<header class="flex justify-end items-center gap-2 p-2">
	<h1 class="flex-grow text-2xl font-bold ml-4">{`Tennis Bracket - ${title}`}</h1>
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
<div
	class="sticky top-0 z-10 border-y-2 border-black overflow-auto overflow-x-hidden syncscroll"
	id="round-header"
	data-name="syncscroll"
>
	<div class="grid" style="grid-template-columns: repeat(5, minmax(200px, 1fr));">
		<div class="bg-white text-center py-2">Round of 16</div>
		<div class="bg-white text-center py-2">Quarterfinals</div>
		<div class="bg-white text-center py-2">Semifinals</div>
		<div class="bg-white text-center py-2">Final</div>
		<div class="bg-white text-center py-2">Champion</div>
	</div>
</div>
<div
	class="relative grid overflow-x-auto syncscroll pb-8"
	id="draw-grid"
	data-name="syncscroll"
	style="grid-template-columns: repeat(5, minmax(200px, 1fr));"
>
	{#each ourRounds as round, index}
		<div class="column">
			{#each slots.filter((slot) => slot.round === round) as slot}
				<div
					class="flex justify-center items-end text-center border-b-2 {!(slot.position % 2) &&
						'border-r-2'} border-black"
					style="height: {getHeight(index, slot.position)}rem"
				>
					{`${slot.seed} ${slot.name}`}
				</div>
			{/each}
		</div>
	{/each}
</div>
