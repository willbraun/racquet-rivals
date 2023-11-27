<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { popup } from '@skeletonlabs/skeleton'
	import ViewPrediction from './ViewPrediction.svelte'
	import type { Prediction, Slot } from '$lib/types'
	import { errorMessage } from '$lib/utils'
	import FormError from '$lib/FormError.svelte'
	import { predictionStore } from '$lib/store'
	import type { PredictionRecord } from '$lib/types'
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

	const disabledOptionStyle = 'pointer-events-none text-sm italic'

	const displayPrediction = (str: string) => {
		if (str) return str

		if (roundIndex === 1) {
			return 'Awaiting previous round'
		} else {
			return 'Predict previous round'
		}
	}

	const addPrediction = async (player: string) => {
		if (prediction?.name === player) {
			return
		}

		loading = true
		error = ''

		if (!pb.authStore.isValid || !pb.authStore.model) {
			error = 'Must be logged in to make a prediction'
			loading = false
			return
		}

		if (!player) {
			error = `Invalid prediction: "${player}"`
			loading = false
			return
		}

		if (!slot) {
			error = `Invalid slot: "${(slot as Slot).id}"`
			loading = false
			return
		}

		const data = {
			draw_slot_id: slot.id,
			user_id: pb.authStore.model.id,
			name: player,
			points: 0
		}

		if (prediction) {
			try {
				const response: PredictionRecord = await pb
					.collection('prediction')
					.update(prediction.id, data)
				const record: Prediction = {
					...response,
					collectionName: 'view_predictions',
					draw_id: slot.draw_id,
					position: slot.position,
					round: slot.round,
					seed: slot.seed,
					username: pb.authStore.model.username
				}

				predictionStore.update((store) => {
					const copy = [...store]
					const index = copy.map((p) => p.id).indexOf(record.id)
					copy.splice(index, 1, record)
					return copy
				})
				prediction = record
			} catch (e) {
				error = errorMessage(e)
			}
		} else {
			try {
				const response: PredictionRecord = await pb.collection('prediction').create(data)
				const record: Prediction = {
					...response,
					collectionName: 'view_predictions',
					draw_id: slot.draw_id,
					position: slot.position,
					round: slot.round,
					seed: slot.seed,
					username: pb.authStore.model.username
				}

				predictionStore.update((store) => [...store, record])
				prediction = record
			} catch (e) {
				error = errorMessage(e)
			}
		}

		loading = false
	}
</script>

<button
	type="button"
	class={`${!prediction && 'chip rounded-full h-6 bg-blue-200 '}
		${!prediction && predictionsAllowed && 'border border-black border-dashed '}
		${predictionsAllowed && 'hover:brightness-105 '}
		${!predictionsAllowed && 'pointer-events-none '}
		${loading && 'brightness-90'}`}
	disabled={!predictionsAllowed}
	use:popup={{
		event: 'click',
		target: `popupCombobox-${player1}-${player2}`,
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

<div class="card shadow-lg" data-popup="popupCombobox-{player1}-{player2}">
	<form>
		<div class="btn-group-vertical">
			<button
				type="submit"
				class={`${!player1 && disabledOptionStyle}`}
				disabled={!player1 || loading}
				on:click|preventDefault={() => addPrediction(player1)}>{displayPrediction(player1)}</button
			>
			<button
				type="submit"
				class={`${!player2 && disabledOptionStyle}`}
				disabled={!player2 || loading}
				on:click|preventDefault={() => addPrediction(player2)}>{displayPrediction(player2)}</button
			>
		</div>
		<FormError bind:error />
	</form>
</div>
