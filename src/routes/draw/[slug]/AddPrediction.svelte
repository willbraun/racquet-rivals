<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { popup } from '@skeletonlabs/skeleton'
	import ViewPrediction from './ViewPrediction.svelte'
	import type { Prediction } from './+page.server'
	import { errorMessage } from '$lib/utils'
	import FormError from '$lib/FormError.svelte'
	import { predictionStore } from '$lib/store'
	export let slotId: string
	export let roundIndex: number
	export let players: [string, string]
	export let prediction: Prediction | undefined
	export let color: string

	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	const [player1, player2] = players

	let loading = false
	let error = ''

	const getDisplay = (str: string) => {
		if (str) return str

		if (roundIndex === 1) {
			return 'Awaiting previous round'
		} else {
			return 'Predict previous round'
		}
	}

	const addPrediction = async (player: string) => {
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

		if (!slotId) {
			error = `Invalid slot: "${slotId}"`
			loading = false
			return
		}

		const data = {
			draw_slot_id: slotId,
			user_id: pb.authStore.model.id,
			name: player.split(' ').at(-1),
			points: 0
		}

		if (prediction?.id) {
			try {
				const record: Prediction = await pb.collection('prediction').update(prediction.id, data)
				predictionStore.update((store) => {
					const copy = [...store]
					const index = copy.map((p) => p.id).indexOf(record.id)
					copy.splice(index, 1, record)
					return copy
				})
			} catch (e) {
				error = errorMessage(e)
			}
		} else {
			try {
				const record: Prediction = await pb.collection('prediction').create(data)
				predictionStore.update((store) => [...store, record])
			} catch (e) {
				error = errorMessage(e)
			}
		}

		loading = false
	}
</script>

<button
	type="button"
	class={`${!prediction && 'chip rounded-full h-6 border border-black border-dashed'}`}
	use:popup={{
		event: 'click',
		target: `popupCombobox-${player1}-${player2}`,
		placement: 'top',
		closeQuery: 'button'
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
	<form>
		<div class="btn-group-vertical">
			<button
				type="submit"
				disabled={!player1 || loading}
				on:click|preventDefault={() => addPrediction(player1)}>{getDisplay(player1)}</button
			>
			<button
				type="submit"
				disabled={!player2 || loading}
				on:click|preventDefault={() => addPrediction(player2)}>{getDisplay(player2)}</button
			>
		</div>
		<FormError bind:error />
	</form>
</div>