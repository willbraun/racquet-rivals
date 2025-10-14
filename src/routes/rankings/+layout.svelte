<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import Header from '$lib/components/Header.svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		children?: Snippet
	}

	let { children }: Props = $props()

	const navigateToPage = (event: Event) => {
		const select = event.target as HTMLSelectElement
		const value = select.value
		goto(`/rankings/${value}`)
	}
</script>

<Header />
<main class="bg-stone-100">
	<div class="mx-auto max-w-(--breakpoint-lg) px-4 pb-16">
		<div class="mb-8 flex flex-wrap items-center gap-4">
			<h1 class="grow text-4xl font-bold sm:text-6xl">Rankings</h1>
			<select
				class="select flex h-11 w-[245px] cursor-pointer items-center bg-stone-200 text-xl md:h-14 md:w-[350px] md:text-3xl"
				onchange={navigateToPage}
			>
				<option value="" selected={page.route?.id === '/rankings'}>Overall</option>
				<option value="average-points" selected={page.route?.id === '/rankings/average-points'}
					>Average Points</option
				>
				<option
					value="prediction-accuracy"
					selected={page.route?.id === '/rankings/prediction-accuracy'}>Prediction Accuracy</option
				>
			</select>
		</div>
		{@render children?.()}
	</div>
</main>
