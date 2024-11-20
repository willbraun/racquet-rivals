<script lang="ts">
	import Pocketbase from 'pocketbase'
	import { popup } from '@skeletonlabs/skeleton'
	import ViewPrediction from './ViewPrediction.svelte'
	import type { Prediction, Slot, AddPredictionResult } from '$lib/types'
	import plus from '$lib/images/icons/plus.svg'
	import { makeSetType } from '$lib/utils'
	import FormError from '$lib/components/FormError.svelte'
	import { predictionStore } from '$lib/store'
	import { enhance } from '$app/forms'
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
	interface Props {
		slot: Slot;
		roundIndex: number;
		players: [string, string];
		prediction: Prediction | undefined;
		predictionsAllowed: boolean;
		getColor: (userId: string | undefined) => string;
	}

	let {
		slot = $bindable(),
		roundIndex,
		players,
		prediction = $bindable(),
		predictionsAllowed,
		getColor
	}: Props = $props();

	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

	let [player1, player2] = $derived(players)

	let loading = $state(false)
	let error = $state('')
	let predictionValue = $state('')

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

	const setTypeAddPredictionResult = makeSetType<AddPredictionResult>()
	const setTypePrediction = makeSetType<Prediction>()
</script>

<button
	type="button"
	class={`${!prediction && 'chip h-6 rounded-full bg-blue-200 '}${!prediction && predictionsAllowed && 'border border-dashed border-black '}${predictionsAllowed && 'hover:brightness-110 '}${!predictionsAllowed && 'pointer-events-none '}${loading && 'brightness-90'}`}
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
		<img src={plus} alt="Add Prediction" width="12" />
	{:else}
		<span class="italic">None</span>
	{/if}
</button>

<!-- Popup form -->
<div class="card w-fit shadow-lg" data-popup="popupCombobox-{slot.id}">
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
		<div class="flex flex-col overflow-hidden rounded">
			<button
				type="submit"
				class="whitespace-nowrap border-b-1 border-surface-500 px-4 py-2 hover:bg-surface-400 {!player1 &&
					'pointer-events-none italic'}"
				disabled={!player1 || !predictionsAllowed || loading}
				onclick={() => (predictionValue = player1)}
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
				onclick={() => (predictionValue = player2)}
			>
				<span class="text-xl">
					{displayPrediction(player2)}
				</span>
			</button>
		</div>
		<FormError bind:error />
	</form>
</div>
