<script lang="ts">
	import { format } from 'date-fns'
	import Header from '$lib/components/Header.svelte'
	import { currentUser } from '$lib/store'
	import { Events } from '$lib/types'
	import type { MyAccountPageData, Subscription, UserDrawEntry } from '$lib/types'
	import { setupPaddle } from '$lib/utils'
	import { onMount } from 'svelte'
	import type { Paddle } from '@paddle/paddle-js'

	interface Props {
		data: MyAccountPageData
	}

	let { data }: Props = $props()

	let paddle = $state<Paddle>()
	onMount(async () => {
		paddle = await setupPaddle()
	})

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMM d, yyyy')
	}

	const openPaddleCustomerPortal = () => {
		if (!paddle || !data.user.paddle_customer_id) {
			return
		}

		// TODO - Open the customer portal
	}
</script>

<Header />
<main class="min-h-screen bg-stone-100">
	<div class="mx-auto max-w-screen-lg px-4 py-8">
		<h1 class="mb-8 text-4xl font-semibold md:text-6xl">My Account</h1>

		{#if data.user.grandfathered}
			<div class="mb-8 rounded-md border-l-4 border-amber-500 bg-amber-50 p-4">
				<p class="text-xl font-semibold">Thank you for being an early supporter!</p>
				<p>As one of our original users, you have unlimited access to all draws.</p>
			</div>
		{/if}

		<section class="mb-8 rounded-xl bg-white p-6 shadow">
			<h2 class="mb-4 text-3xl font-semibold">Subscription Status</h2>
			{#if data.subscription}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<p class="text-lg font-medium">Status:</p>
						<p class="text-xl capitalize">
							{#if data.subscription.status === 'active'}
								<span class="font-bold text-green-600">Active</span>
							{:else if data.subscription.status === 'past_due'}
								<span class="font-bold text-amber-600">Past Due</span>
							{:else}
								<span class="font-bold text-red-600">Canceled</span>
							{/if}
						</p>
					</div>
					<div>
						<p class="text-lg font-medium">Billing Start Date:</p>
						<p class="text-xl">{formatDate(data.subscription.current_billing_period_start)}</p>
					</div>
					<div>
						<p class="text-lg font-medium">Billing End Date:</p>
						<p class="text-xl">{formatDate(data.subscription.current_billing_period_end)}</p>
					</div>
				</div>

				{#if data.subscription}
					<button
						class="mt-6 rounded-lg bg-primary-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-primary-600"
						onclick={openPaddleCustomerPortal}
					>
						Manage Subscription
					</button>
				{/if}
			{:else}
				<p class="text-xl">No active subscription.</p>
				{#if !data.user.grandfathered}
					<a
						href="/pricing"
						class="mt-4 inline-block rounded-lg bg-primary-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-primary-600"
					>
						View Plans
					</a>
				{/if}
			{/if}
		</section>

		<section class="mb-8 rounded-xl bg-white p-6 shadow">
			<h2 class="mb-4 text-3xl font-semibold">Draw Entries</h2>
			{#if data.enteredDraws.length > 0}
				<div class="overflow-x-auto">
					<table class="w-full border-collapse">
						<thead>
							<tr class="bg-primary-700 text-white">
								<th class="p-3 text-left">Tournament</th>
								<th class="p-3 text-left">Event</th>
								<th class="p-3 text-left">Purchased</th>
							</tr>
						</thead>
						<tbody>
							{#each data.enteredDraws as draw, i}
								<tr class={i % 2 === 0 ? 'bg-primary-50' : 'bg-primary-200'}>
									<td class="p-3">{draw.name}</td>
									<td class="p-3">{draw.event}</td>
									<td class="p-3">{formatDate(draw.start_date)}</td>
									<td class="p-3">{formatDate(draw.end_date)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="text-xl">No individual draw entries.</p>
				{#if !data.subscription && !data.user.grandfathered}
					<a
						href="/pricing"
						class="mt-4 inline-block rounded-lg bg-primary-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-primary-600"
					>
						Purchase Entries
					</a>
				{/if}
			{/if}
		</section>
	</div>
</main>
