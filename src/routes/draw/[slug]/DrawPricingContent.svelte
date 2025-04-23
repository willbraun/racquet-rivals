<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Draw } from '$lib/types'

	interface Props {
		draw: Draw
		onClose: () => void
	}

	let { draw, onClose }: Props = $props()

	let eventType = $derived(draw.event.split("'")[0])
	let otherEventType = $derived(eventType === 'Men' ? 'Women' : 'Men')
</script>

<div>
	<p class="text-center italic">Choose your plan to enter the {draw.name} {draw.event} draw</p>
	<div class="my-6 flex flex-col items-center justify-center space-y-5">
		<!-- Single draw -->
		<div
			class="bg-surface-50-900-token flex w-full items-center justify-between rounded-lg border p-5 transition-all duration-200 hover:border-primary-500 hover:shadow-md"
		>
			<div>
				<p class="text-lg font-bold">{eventType}'s Draw Access</p>
				<p class="text-gray-600">Access the {eventType.toLowerCase()}'s tournament</p>
			</div>
			<button
				class="variant-filled-primary btn px-6 transition-transform duration-200 hover:scale-105"
				>$4.99</button
			>
		</div>

		<!-- Bundle -->
		<div
			class="bg-surface-50-900-token relative flex w-full items-center justify-between rounded-lg border px-5 py-8 transition-all duration-200 hover:border-primary-500 hover:shadow-md"
		>
			<div
				class="absolute left-0 top-0 rounded-br-lg rounded-tl-md bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-md"
			>
				SAVE 20%
			</div>
			<div>
				<p class="text-lg font-bold">{eventType}'s + {otherEventType}'s Bundle</p>
				<p class="text-gray-600">Access both tournaments</p>
			</div>
			<button
				class="variant-filled-primary btn px-6 transition-transform duration-200 hover:scale-105"
				>$7.99</button
			>
		</div>

		<!-- Annual subscription -->
		<div
			class="relative flex w-full items-center justify-between rounded-lg border border-primary-500 px-5 py-8 transition-all duration-200 hover:shadow-lg dark:bg-primary-900/20"
		>
			<div
				class="absolute left-0 top-0 rounded-br-lg rounded-tl-md bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-md"
			>
				BEST VALUE, SAVE 50%
			</div>
			<div>
				<p class="text-lg font-bold">Annual Subscription</p>
				<p class="text-gray-600">All tournaments for a full year</p>
			</div>
			<button
				class="variant-filled-primary btn px-6 transition-transform duration-200 hover:scale-105"
				>$19.99</button
			>
		</div>
		<button
			type="button"
			class="mt-2 flex justify-center font-medium text-primary-500 transition-colors hover:text-primary-700 hover:underline"
			onclick={() => {
				onClose()
				goto('/pricing')
			}}
		>
			View all plans
		</button>
	</div>
</div>
