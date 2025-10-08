<script lang="ts">
	import type { Prediction } from '$lib/types'

	interface Props {
		prediction: Prediction
	}

	let { prediction }: Props = $props()

	let display = $derived(prediction.name.replace(') ', '').split(' ').slice(1).join(' '))
</script>

<div
	class="chip pointer-events-none relative flex h-6 w-fit items-center justify-between rounded-full text-black {prediction.color} shadow-sm duration-0"
>
	<div>
		<p class="text-xs">{display}</p>
	</div>
	{#if prediction.points}
		<div
			class="badge-icon absolute -right-1.5 -top-1 z-10 aspect-square h-4 w-fit rounded-full bg-green-400 px-1 text-sm"
		>
			<p>{prediction.points}</p>
		</div>
	{/if}
</div>
