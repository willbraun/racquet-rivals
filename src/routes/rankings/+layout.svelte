<script lang="ts">
	import { goto } from '$app/navigation'
	import Header from '$lib/components/Header.svelte'

	const navigateToPage = (event: Event) => {
		const select = event.target as HTMLSelectElement
		const value = select.value
		goto(`/rankings/${value}`)
	}
</script>

<Header />
<main class="bg-stone-100">
	<div class="mx-auto max-w-screen-lg px-4">
		<div class="mb-8 flex items-center">
			<h1 class="flex-grow text-4xl font-bold md:text-7xl">Rankings</h1>
			<select
				class="select h-11 w-[220px] cursor-pointer border-none bg-stone-200 text-xl md:h-14 md:w-[320px] md:text-3xl"
				on:change={navigateToPage}
			>
				<option value="">Overall</option>
				<option value="average-points">Average Points</option>
				<option value="prediction-accuracy">Prediction Accuracy</option>
			</select>
		</div>
		<slot />
	</div>
</main>
