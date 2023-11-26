<script lang="ts">
	import type { Prediction } from './+page.server'

	export let prediction: Prediction
	export let getColor: (userId: string | undefined) => string

	let color = getColor(prediction.user_id)
	$: display = prediction.name.split(' ').at(-1)
</script>

<div
	class={`relative chip pointer-events-none flex justify-between items-center rounded-full h-6 w-fit text-black ${color} shadow`}
>
	<div>
		<p class="text-xs">{display}</p>
	</div>
	{#if prediction.points}
		<div
			class="absolute badge-icon -top-1 -right-2 rounded-full aspect-square h-4 text-sm bg-green-400 z-10"
		>
			<p>{prediction.points}</p>
		</div>
	{/if}
</div>
