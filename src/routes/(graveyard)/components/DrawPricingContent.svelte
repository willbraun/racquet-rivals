<!-- <script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import {
		PUBLIC_PADDLE_BOTH_DRAWS_PRICE_ID,
		PUBLIC_PADDLE_MENS_DRAW_PRICE_ID,
		PUBLIC_PADDLE_SUBSCRIPTION_PRICE_ID,
		PUBLIC_PADDLE_WOMENS_DRAW_PRICE_ID
	} from '$env/static/public'
	import { currentUser } from '$lib/store'
	import { PlanName, type Draw } from '$lib/types'
	import { getSlug, logErrorInDev, setupPaddle } from '$lib/utils'
	import type { Paddle } from '@paddle/paddle-js'
	import { onMount } from 'svelte'

	interface Props {
		draw: Draw
		mensDraw: Draw | undefined
		womensDraw: Draw | undefined
		onClose: () => void
	}

	let { draw, mensDraw, womensDraw, onClose }: Props = $props()

	interface SingleDrawMap {
		[key: string]: {
			priceId: string
			plan: PlanName
		}
	}

	const singleDrawMap: SingleDrawMap = {
		Men: {
			priceId: PUBLIC_PADDLE_MENS_DRAW_PRICE_ID,
			plan: PlanName.MEN
		},
		Women: {
			priceId: PUBLIC_PADDLE_WOMENS_DRAW_PRICE_ID,
			plan: PlanName.WOMEN
		}
	}

	let eventType = $derived(draw.event.split("'")[0])
	let otherEventType = $derived(eventType === 'Men' ? 'Women' : 'Men')

	let paddle = $state<Paddle>()
	onMount(async () => {
		paddle = await setupPaddle()
		if (!paddle) {
			logErrorInDev('Paddle is not initialized')
			return
		}
	})

	const openPaddleCheckout = (priceId: string, plan: PlanName) => {
		if (!paddle) {
			logErrorInDev('Paddle is not initialized')
			return
		}

		if (!$currentUser) {
			logErrorInDev('Current user is not available')
			return
		}

		if (!mensDraw) {
			logErrorInDev('Mens draw is not available')
			return
		}

		if (!womensDraw) {
			logErrorInDev('Womens draw is not available')
			return
		}

		paddle?.Checkout.open({
			items: [
				{
					priceId,
					quantity: 1
				}
			],
			customData: {
				user_id: $currentUser.id,
				mens_draw_id: mensDraw.id,
				womens_draw_id: womensDraw.id
			},
			settings: {
				showAddDiscounts: false,
				theme: 'light',
				successUrl: `${page.url.origin}/thank-you?plan=${plan}&mensDrawSlug=${getSlug(mensDraw)}&womensDrawSlug=${getSlug(womensDraw)}`
			}
		})
	}
</script>

<header>
	<h2 class="text-2xl font-bold">Select Plan</h2>
</header>
<div class="my-6 flex flex-col items-center justify-center space-y-5">
	<div
		class="flex w-full items-center justify-between gap-2 rounded-lg border p-5 transition-all duration-200 hover:border-primary-500 hover:shadow-md"
	>
		<div>
			<p class="font-bold sm:text-lg">{draw.name} {draw.year} {eventType}'s Draw</p>
			<p class="text-sm text-gray-600 sm:text-base">Play the {eventType.toLowerCase()}'s draw</p>
		</div>
		<button
			type="button"
			class="preset-filled-primary-500 btn px-6 transition-transform duration-200 hover:scale-105"
			onclick={() =>
				openPaddleCheckout(singleDrawMap[eventType].priceId, singleDrawMap[eventType].plan)}
			>$4.99</button
		>
	</div>
	<div
		class="relative flex w-full items-center justify-between gap-2 rounded-lg border px-5 py-8 transition-all duration-200 hover:border-primary-500 hover:shadow-md"
	>
		<div
			class="absolute left-0 top-0 rounded-br-lg rounded-tl-md bg-linear-to-r from-green-500 to-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-md"
		>
			SAVE 20%
		</div>
		<div>
			<p class="font-bold sm:text-lg">
				{draw.name}
				{draw.year}
				{eventType}'s + {otherEventType}'s Bundle
			</p>
			<p class="text-sm text-gray-600 sm:text-base">Play both draws</p>
		</div>
		<button
			type="button"
			class="preset-filled-primary-500 btn px-6 transition-transform duration-200 hover:scale-105"
			onclick={() => openPaddleCheckout(PUBLIC_PADDLE_BOTH_DRAWS_PRICE_ID, PlanName.BOTH)}
		>
			$7.99
		</button>
	</div>
	<div
		class="relative flex w-full items-center justify-between gap-2 rounded-lg border border-primary-500 px-5 py-8 transition-all duration-200 hover:shadow-lg dark:bg-primary-900/20"
	>
		<div
			class="absolute left-0 top-0 rounded-br-lg rounded-tl-md bg-linear-to-r from-orange-500 to-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-md"
		>
			BEST VALUE, SAVE 50%
		</div>
		<div>
			<p class="font-bold sm:text-lg">Annual Subscription</p>
			<p class="text-sm text-gray-600 sm:text-base">
				Play all men's and women's draws for a full year
			</p>
		</div>
		<button
			type="button"
			class="preset-filled-primary-500 btn px-6 transition-transform duration-200 hover:scale-105"
			onclick={() => openPaddleCheckout(PUBLIC_PADDLE_SUBSCRIPTION_PRICE_ID, PlanName.SUBSCRIPTION)}
		>
			$19.99
		</button>
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
<footer class="modal-footer flex justify-end gap-2">
	<button
		class="preset-tonal btn transition-all duration-200 hover:preset-tonal-primary"
		onclick={onClose}
	>
		Close
	</button>
</footer> -->
