<script lang="ts">
	import Prediction from '$lib/Prediction.svelte'
	import Logout from '$lib/Logout.svelte'
	export let data

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

<header class="grid grid-cols-4 items-center p-2">
	<h1 class="col-span-3 text-lg md:text-2xl font-bold ml-4">{`Tennis Bracket - ${title}`}</h1>
	<div class="col-span-1 flex justify-end gap-2 flex-wrap">
		{#if data.auth.token}
			<Logout />
		{:else}
			<a href="/login">
				<button type="button" class="btn btn-sm md:btn-md variant-ghost rounded-lg">Login</button>
			</a>
			<a href="/create-account">
				<button type="button" class="btn btn-sm md:btn-md variant-filled rounded-lg">Sign up</button
				>
			</a>
		{/if}
	</div>
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
	class="relative grid overflow-x-auto syncscroll pb-24"
	id="draw-grid"
	data-name="syncscroll"
	style="grid-template-columns: repeat(5, minmax(200px, 1fr));"
>
	{#each ourRounds as round, index}
		<div class="column">
			{#each slots.filter((slot) => slot.round === round) as slot}
				<div
					class="relative flex justify-center items-end text-center border-b-2 border-black"
					class:border-r-2={!(slot.position % 2)}
					style="height: {getHeight(index, slot.position)}rem"
				>
					<p>{`${slot.seed} ${slot.name}`}</p>
					{#if index > 0}
						<div
							class="absolute bottom-0 translate-y-full border border-red-500 h-20 w-full flex flex-wrap justify-center p-1 gap-1"
						>
							<!-- render predictions for current user and all selected users -->
							<Prediction name={''} />
							<Prediction name={'Alcaraz'} />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>
