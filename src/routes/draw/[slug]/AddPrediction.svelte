<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { popup } from '@skeletonlabs/skeleton'
	import ViewPrediction from './ViewPrediction.svelte'
	import type { Prediction, Slot, AddPredictionResult } from '$lib/types'
	import { makeSetType } from '$lib/utils'
	import FormError from '$lib/FormError.svelte'
	import { predictionStore } from '$lib/store'
	import { enhance } from '$app/forms'
	export let slot: Slot
	export let roundIndex: number
	export let players: [string, string]
	export let prediction: Prediction | undefined
	export let predictionsAllowed: boolean
	export let getColor: (userId: string | undefined) => string

	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	$: [player1, player2] = players

	let loading = false
	let error = ''
	let predictionValue = ''

	const displayPrediction = (str: string) => {
		if (str) return str

		if (roundIndex === 1) {
			return 'Awaiting previous round'
		} else {
			return 'Predict previous round'
		}
	}

	const setTypeAddPredictionResult = makeSetType<AddPredictionResult>()
	const setTypePrediction = makeSetType<Prediction>()
</script>

<button
	type="button"
	class={`${!prediction && 'chip rounded-full h-6 bg-blue-200 '}
		${!prediction && predictionsAllowed && 'border border-black border-dashed '}
		${predictionsAllowed && 'hover:brightness-110 '}
		${!predictionsAllowed && 'pointer-events-none '}
		${loading && 'brightness-90'}`}
	disabled={!predictionsAllowed}
	use:popup={{
		event: 'click',
		target: `popupCombobox-${slot.id}`,
		placement: 'top',
		closeQuery: 'button'
	}}
>
	{#if prediction}
		<ViewPrediction {prediction} {getColor} />
	{:else if predictionsAllowed}
		<span class="text-xs">Add</span>
		<svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 0 448 512"
			><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
				d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
			/></svg
		>
	{:else}
		<p class="italic">None</p>
	{/if}
</button>

<!-- Popup form -->
<div class="card shadow-lg w-fit" data-popup="popupCombobox-{slot.id}">
	<form
		method="POST"
		action="?/addPrediction"
		use:enhance={() => {
			loading = true
			error = ''
			return async ({ result, update }) => {
				await update()
				const typedResult = setTypeAddPredictionResult(result)
				if (result.status == 200) {
					const record = setTypePrediction({
						...typedResult.data.record,
						collectionName: 'view_predictions',
						draw_id: slot.draw_id,
						position: slot.position,
						round: slot.round,
						seed: slot.seed,
						username: pb.authStore.model?.username ?? ''
					})

					predictionStore.update((store) => {
						const copy = [...store]
						const index = copy.map((p) => p.id).indexOf(record.id)
						copy.splice(index, 1, record)
						return copy
					})
					prediction = record
				} else {
					error = typedResult.data.error
				}
				loading = false
			}
		}}
	>
		<input type="hidden" name="slotId" bind:value={slot.id} />
		<input type="hidden" name="currentPredictionId" value={prediction?.id ?? ''} />
		<input type="hidden" name="predictionValue" bind:value={predictionValue} />
		<div class="flex flex-col rounded overflow-hidden">
			<button
				type="submit"
				class={`hover:bg-surface-400 whitespace-nowrap px-4 py-2 border-b-[1px] border-surface-500 ${
					!player1 && 'pointer-events-none italic'
				}`}
				disabled={!player1 || loading}
				on:click={() => (predictionValue = player1)}
			>
				<span class="text-xl">
					{displayPrediction(player1)}
				</span>
			</button>
			<button
				type="submit"
				class={`hover:bg-surface-400 whitespace-nowrap px-4 py-2 ${
					!player2 && 'pointer-events-none italic'
				}`}
				disabled={!player2 || loading}
				on:click={() => (predictionValue = player2)}
			>
				<span class="text-xl">
					{displayPrediction(player2)}
				</span>
			</button>
		</div>
		<FormError bind:error />
	</form>
</div>
