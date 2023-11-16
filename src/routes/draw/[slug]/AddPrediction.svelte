<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton'
	import ViewPrediction from './ViewPrediction.svelte'
	import type { Prediction } from './+page.server'
	import { enhance } from '$app/forms'
	export let slotId: string
	export let roundIndex: number
	export let players: [string, string]
	export let prediction: Prediction | undefined
	export let color: string

	const [player1, player2] = players

	let predictionValue: string

	const getDisplay = (str: string) => {
		if (str) return str

		if (roundIndex === 1) {
			return 'Awaiting previous round'
		} else {
			return 'Predict previous round'
		}
	}

	const handleClick = (value: string) => {
		predictionValue = value
	}
</script>

<button
	type="button"
	class={`${!prediction && 'chip rounded-full h-6 border border-black border-dashed'}`}
	use:popup={{
		event: 'click',
		target: `popupCombobox-${player1}-${player2}`,
		placement: 'top',
		closeQuery: '.listbox-item'
	}}
>
	{#if prediction}
		<ViewPrediction name={prediction.name} points={prediction.points} {color} />
	{:else}
		<!-- TO DO - if predictions are still open -->
		<span class="text-xs">Add</span>
		<svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 0 448 512"
			><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
				d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
			/></svg
		>
		<!-- else -->
		<!-- message that says None in italics -->
	{/if}
</button>

<div class="card shadow-lg" data-popup="popupCombobox-{player1}-{player2}">
	<form
		method="POST"
		action="?/addPrediction"
		use:enhance={() => {
			return async ({ update }) => {
				await update()
			}
		}}
	>
		<input type="hidden" name="slotId" bind:value={slotId} />
		<input type="hidden" name="currentPredictionId" value={prediction?.id ?? ''} />
		<input type="hidden" name="predictionValue" bind:value={predictionValue} />
		<div class="btn-group-vertical">
			<button type="submit" disabled={!player1} on:click={() => handleClick(player1)}
				>{getDisplay(player1)}</button
			>
			<button type="submit" disabled={!player2} on:click={() => handleClick(player2)}
				>{getDisplay(player2)}</button
			>
		</div>
	</form>
</div>
