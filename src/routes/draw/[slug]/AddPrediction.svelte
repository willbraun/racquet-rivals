<script lang="ts">
	import { browser } from '$app/environment'
	import FormError from '$lib/components/FormError.svelte'
	import { mainColor } from '$lib/data'
	import plus from '$lib/images/icons/plus.svg'
	import { pb } from '$lib/pocketbase'
	import { predictionStore } from '$lib/store'
	import type { Prediction, PredictionRecord, Slot } from '$lib/types'
	import { errorMessage } from '$lib/utils'
	import { popup } from '@skeletonlabs/skeleton'
	import type { ClientResponseError } from 'pocketbase'
	import ViewPrediction from './ViewPrediction.svelte'

	interface Props {
		slot: Slot
		roundIndex: number
		players: [string, string]
		prediction: Prediction | undefined
		predictionsAllowed: boolean
	}

	let {
		slot = $bindable(),
		roundIndex,
		players,
		prediction = $bindable(),
		predictionsAllowed
	}: Props = $props()

	let [player1, player2] = $derived(players)

	let loading = $state(false)
	let error = $state('')
	let predictionValue = $state(prediction?.name ?? '')

	const displayPrediction = (str: string) => {
		if (str) return str

		if (roundIndex < 1 || roundIndex > 4) {
			return 'Invalid round index'
		} else if (roundIndex === 1) {
			return 'Awaiting previous round'
		} else {
			return 'Predict previous round'
		}
	}

	const selectPlayer = (player: string) => {
		predictionValue = player
	}

	const handleSubmit = async (event: Event) => {
		event.preventDefault()
		loading = true
		error = ''

		try {
			// No change
			if (predictionValue === prediction?.name) {
				return
			}

			// Validation
			if (!pb.authStore.isValid || !pb.authStore.record) {
				error = 'Must be logged in to make a prediction'
				return
			}

			if (!predictionValue) {
				error = `Invalid prediction: "${predictionValue}"`
				return
			}

			if (!slot.id) {
				error = `Invalid slot: "${slot.id}"`
				return
			}

			// Prepare data
			const data = {
				draw_slot_id: slot.id,
				user_id: pb.authStore.record.id,
				name: predictionValue,
				points: 0
			}

			let record: PredictionRecord

			// Update or create prediction
			if (prediction?.id) {
				record = await pb.collection('prediction').update(prediction.id, data)
			} else {
				record = await pb.collection('prediction').create(data)
			}

			// Create the prediction object for the store
			const newPrediction = {
				...record,
				collectionName: 'view_predictions',
				draw_id: slot.draw_id,
				position: slot.position,
				round: slot.round,
				seed: slot.seed,
				username: pb.authStore.record?.username ?? '',
				color: mainColor
			} as Prediction

			// Update the prediction store
			predictionStore.update((store) => {
				const copy = [...store]
				const index = copy.map((p) => p.id).indexOf(newPrediction.id)

				if (index >= 0) {
					// Update existing prediction
					copy.splice(index, 1, newPrediction)
				} else {
					// Add new prediction
					copy.push(newPrediction)
				}

				return copy
			})

			// Update the local prediction
			prediction = newPrediction
		} catch (e) {
			const statusCode = (e as ClientResponseError).status
			if (statusCode) {
				error = errorMessage(e)
			} else {
				error = 'An unexpected error occurred'
			}
		} finally {
			loading = false
		}
	}
</script>

<!-- Show nothing while client loading to avoid flash of incorrect state -->
{#if browser}
	<button
		type="button"
		class={`${!prediction && 'chip h-6 rounded-full bg-blue-200 '}${!prediction && predictionsAllowed && 'border border-dashed border-black '}${predictionsAllowed && 'hover:brightness-105 '}${!predictionsAllowed && 'pointer-events-none '}${loading && 'brightness-90'}`}
		disabled={!predictionsAllowed}
		use:popup={{
			event: 'click',
			target: `popupCombobox-${slot.id}`,
			placement: 'top',
			closeQuery: 'button'
		}}
	>
		{#if prediction}
			<ViewPrediction {prediction} />
		{:else if predictionsAllowed}
			<span class="text-xs">Add</span>
			<img src={plus} alt="Add Prediction" width="12" />
		{:else}
			<span class="text-xs italic">None</span>
		{/if}
	</button>
{/if}

<!-- Popup form -->
<div class="card w-fit shadow-lg" data-popup="popupCombobox-{slot.id}">
	<form onsubmit={handleSubmit}>
		<div class="flex flex-col overflow-hidden rounded">
			<button
				type="submit"
				class="whitespace-nowrap border-b-1 border-surface-500 px-4 py-2 hover:bg-surface-400 {!player1 &&
					'pointer-events-none italic'}"
				disabled={!player1 || !predictionsAllowed || loading}
				onclick={() => selectPlayer(player1)}
			>
				<span class="text-xl">
					{displayPrediction(player1)}
				</span>
			</button>
			<button
				type="submit"
				class="whitespace-nowrap px-4 py-2 hover:bg-surface-400 {!player2 &&
					'pointer-events-none italic'}"
				disabled={!player2 || !predictionsAllowed || loading}
				onclick={() => selectPlayer(player2)}
			>
				<span class="text-xl">
					{displayPrediction(player2)}
				</span>
			</button>
		</div>
		<FormError {error} />
	</form>
</div>
