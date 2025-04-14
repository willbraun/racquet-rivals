<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import { page } from '$app/state'
	import { TournamentName, type Draw } from '$lib/types'
	import { bannerStyleMap, pricingHeaderStyleMap } from '$lib/data'

	const draw: Draw = page.data.defaultDraw
	const header = `${draw.name} ${draw.year}`

	const pricingOptions = [
		{
			title: "Men's Draw",
			price: '$4.99',
			header: header,
			features: [
				"Access to make predictions for men's singles draw",
				'Earn points and a global ranking',
				'View all rankings, leaderboards, and stats'
			]
		},
		{
			title: "Women's Draw",
			price: '$4.99',
			header: header,
			features: [
				"Access to make predictions for women's singles draw",
				'Earn points and a global ranking',
				'View all rankings, leaderboards, and stats'
			]
		},
		{
			title: 'Both Draws',
			price: '$7.99',
			header: header,
			features: [
				"Access to make predictions for men's and women's singles draws",
				'20% savings',
				'Earn points and a global ranking',
				'View all rankings, leaderboards, and stats'
			]
		},
		{
			title: 'Full Access Subscription',
			price: '$19.99/yr',
			featured: true,
			features: [
				'Access to make predictions for all draws throughout the year',
				'50% savings',
				'One-time setup',
				'Earn points and a global ranking',
				'View all rankings, leaderboards, and stats'
			]
		}
	]
</script>

<Header />
<main class="bg-stone-100 px-4 pb-24 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-semibold sm:text-6xl">Pricing Plans</h1>
			<p class="mx-auto max-w-3xl text-xl text-gray-600">
				Choose the plan that works best for you and get ready to make your predictions.
			</p>
		</div>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each pricingOptions as option}
				<div
					class="relative flex flex-col overflow-hidden rounded-lg border shadow-lg {option.featured
						? 'border-primary-500 ring-2 ring-primary-500'
						: 'border-gray-200'}"
				>
					{#if option.header}
						<div
							class="absolute w-full py-1 text-center text-sm font-semibold text-white {pricingHeaderStyleMap[
								draw.name
							]}"
						>
							{option.header}
						</div>
					{/if}
					<div class="bg-white px-0 py-8 sm:pb-6">
						<div class="flex h-16 items-end justify-center">
							<p class="text-center text-3xl font-bold text-gray-900">{option.title}</p>
						</div>
						<div class="mt-6 flex items-end justify-center">
							<span class="text-5xl font-extrabold text-gray-900">{option.price}</span>
						</div>
					</div>
					<div
						class="flex flex-1 flex-col justify-between space-y-6 bg-gray-50 px-6 pb-8 pt-6 sm:p-10 sm:pt-6"
					>
						<ul class="space-y-4">
							{#each option.features as feature}
								<li class="flex items-start">
									<div class="flex-shrink-0">
										<svg
											class="h-6 w-6 text-green-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<p class="ml-3 text-base text-gray-700">{feature}</p>
								</li>
							{/each}
						</ul>
						<div class="mt-8">
							<button
								type="button"
								class="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
							>
								{option.featured ? 'Get Started' : 'Select'}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>
