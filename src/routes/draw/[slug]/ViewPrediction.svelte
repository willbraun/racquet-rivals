<script lang="ts">
	import type { Prediction } from '$lib/types'

	export let prediction: Prediction
	export let getColor: (userId: string | undefined) => string

	$: color = getColor(prediction.user_id)
	$: display = prediction.name.split('.').at(-1)?.trim()
</script>

<div
	class="relative chip pointer-events-none flex justify-between items-center rounded-full h-6 w-fit text-black {color} shadow"
>
	<div>
		<p class="text-xs">{display}</p>
	</div>
	{#if prediction.points}
		<div
			class="absolute badge-icon -top-1 -right-1.5 rounded-full aspect-square h-4 w-fit px-1 text-sm bg-green-400 z-10"
		>
			<p>{prediction.points}</p>
		</div>
	{/if}
</div>
