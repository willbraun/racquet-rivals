<!-- <script lang="ts">
	import { format } from 'date-fns'
	import Header from '$lib/components/Header.svelte'
	import type { MyAccountPageData } from '$lib/types'
	import { getSlug, getTitle } from '$lib/utils'
	import { goto } from '$app/navigation'
	import externalLink from '$lib/images/icons/arrow-up-right-from-square-solid.svg'

	interface Props {
		data: MyAccountPageData
	}

	let { data }: Props = $props()

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'MMM d, yyyy')
	}

	const openPaddleCustomerPortal = () => {
		if (!data.paddleCustomerPortalUrl) {
			return
		}

		window.open(data.paddleCustomerPortalUrl)
	}
</script>

<Header />
<main class="min-h-screen bg-stone-100">
	<div class="mx-auto max-w-screen-lg px-4 py-8">
		<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
			<h1 class="text-4xl font-bold md:text-6xl">My Account</h1>
			{#if data.user.paddle_customer_id}
				{#if data.paddleCustomerPortalUrl}
					<button
						type="button"
						class="variant-filled-primary btn font-semibold shadow"
						onclick={openPaddleCustomerPortal}
					>
						<p>Manage Payments</p>
						<img
							src={externalLink}
							alt="External link icon"
							class="ml-2 inline h-4 w-4 invert"
							width="16"
						/>
					</button>
				{:else}
					<p class="text-red-500">Error displaying Manage Payments link</p>
				{/if}
			{/if}
		</div>
		{#if data.user.grandfathered}
			<div class="mb-8 rounded-md border-l-4 border-green-500 bg-green-100 p-4 shadow">
				<p class="text-xl font-semibold">Thanks for being an early supporter of Racquet Rivals!</p>
				<p>As one of our original members, you have access to all draws.</p>
			</div>
		{/if}
		<section class="mb-8 flex flex-col gap-4 rounded-xl bg-white p-4 shadow sm:gap-6 sm:p-6">
			<h2 class="text-3xl font-semibold">Subscription Status</h2>
			{#if data.subscription}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<p class="text-lg font-medium">Status</p>
						<p class="text-xl">
							{#if data.subscription.status === 'active'}
								<span class="font-bold text-green-600">Active</span>
							{:else if data.subscription.status === 'past_due'}
								<span class="font-bold text-amber-600">Past Due</span>
							{:else}
								<span class="font-bold text-gray-600">{data.subscription.status}</span>
							{/if}
						</p>
					</div>
					<div>
						<p class="text-lg font-medium">Billing Start Date</p>
						<p class="text-xl">{formatDate(data.subscription.current_billing_period_start)}</p>
					</div>
					<div>
						<p class="text-lg font-medium">Billing End Date</p>
						<p class="text-xl">{formatDate(data.subscription.current_billing_period_end)}</p>
					</div>
				</div>
			{:else}
				<p class="text-xl">No active subscription.</p>
				{#if !data.user.grandfathered}
					<a href="/pricing" class="variant-filled-primary btn inline-block w-fit font-semibold">
						View Plans
					</a>
				{/if}
			{/if}
		</section>
		<section class="mb-8 flex flex-col gap-4 rounded-xl bg-white p-4 shadow sm:gap-6 sm:p-6">
			<h2 class="text-3xl font-semibold">Draw Entries</h2>
			{#if data.entries.length > 0}
				<div class="overflow-x-auto">
					<table class="w-full border-collapse overflow-hidden rounded-lg">
						<thead>
							<tr class="bg-primary-700 text-xl text-white">
								<th class="p-4 text-left">Draw</th>
								<th class="p-4 text-left">Purchase Date</th>
							</tr>
						</thead>
						<tbody>
							{#each data.entries as draw, i}
								<tr
									class={`hover:cursor-pointer hover:brightness-105 ${i % 2 === 0 ? 'bg-primary-50' : 'bg-primary-200'}`}
									onclick={() => goto(`/draw/${getSlug(draw)}`)}
								>
									<td class="p-4 font-medium sm:text-lg">{getTitle(draw)}</td>
									<td class="p-4 font-medium sm:text-lg">{formatDate(draw.created)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="text-xl">No draw entry purchases.</p>
			{/if}
			{#if !data.subscription && !data.user.grandfathered}
				<a href="/pricing" class="variant-filled-primary btn inline-block w-fit font-semibold">
					Purchase Entries
				</a>
			{/if}
		</section>
	</div>
</main> -->
