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
			class="badge-icon absolute -top-1 -right-2 z-10 h-4 w-fit rounded-full bg-green-400 py-0 text-sm font-medium"
		>
			{prediction.points}
		</div>
	{/if}
</div>
