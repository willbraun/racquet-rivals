<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import { PlanName, UserAccess, type PricingPageData, type SelectedPlan } from '$lib/types'
	import { pricingHeaderStyleMap } from '$lib/data'
	import { currentUser, isAuth, loginGoto } from '$lib/store'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { initializePaddle, type Paddle, type Environments } from '@paddle/paddle-js'
	import {
		PUBLIC_PADDLE_CLIENT_TOKEN,
		PUBLIC_PADDLE_ENVIRONMENT,
		PUBLIC_PADDLE_BOTH_DRAWS_PRICE_ID,
		PUBLIC_PADDLE_MENS_DRAW_PRICE_ID,
		PUBLIC_PADDLE_SUBSCRIPTION_PRICE_ID,
		PUBLIC_PADDLE_WOMENS_DRAW_PRICE_ID
	} from '$env/static/public'

	interface Props {
		data: PricingPageData
	}

	let { data }: Props = $props()
	let paddle = $state<Paddle>()

	const mensDraw = data.mensDraw
	const womensDraw = data.womensDraw
	const header = `${mensDraw.name} ${mensDraw.year}`

	const selectedPlan = page.url.searchParams.get('selectedPlan')
	if (selectedPlan) {
		// TODO - if selectedPlan is not valid for that user (grandfathered, subscribed, already has access to draw or partial access to both), don't redirect to the checkout
		console.log('Selected plan from redirect:', selectedPlan) // TODO - update this with real checkout
		history.replaceState(null, '', '/pricing')
	}

	const openPaddleCheckout = (option: PricingOption) => {
		if (!paddle) {
			console.error('Paddle is not initialized')
			return
		}

		if (!$currentUser) {
			console.error('Current user is not available')
			return
		}

		paddle?.Checkout.open({
			items: [
				{
					priceId: option.priceId,
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
				successUrl: `${page.url.origin}/thank-you?plan=${option.plan}`
			}
		})
	}

	const handleClick = (option: PricingOption) => {
		if ($isAuth) {
			openPaddleCheckout(option)
		} else {
			const selectedPlan: SelectedPlan = { plan: option.plan, title: option.title }
			sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan))
			goto('/create-account')
		}
	}

	const validatePaddleEnvironment = (env: string): Environments => {
		if (env !== 'sandbox' && env !== 'production') {
			throw new Error(`Invalid Paddle environment: ${env}. Must be 'sandbox' or 'production'.`)
		}
		return env as Environments
	}

	onMount(() => {
		loginGoto.set('/pricing')

		initializePaddle({
			environment: validatePaddleEnvironment(PUBLIC_PADDLE_ENVIRONMENT),
			token: PUBLIC_PADDLE_CLIENT_TOKEN,
			checkout: {
				settings: {
					displayMode: 'overlay'
				}
			}
		})
			.then((paddleInstance) => {
				paddle = paddleInstance
			})
			.catch((error) => {
				console.error('Failed to initialize Paddle:', error)
			})
	})

	const grandfatheredMessage = 'No charge for you. Thanks for being an early supporter!'

	type PricingOption = {
		title: string
		plan: PlanName
		price: string
		priceId: string
		header?: string
		featured?: boolean
		features: string[]
		messages: {
			[userAccess: string]: string
		}
	}

	const pricingOptions: PricingOption[] = [
		{
			title: "Men's Draw",
			plan: PlanName.MEN,
			price: '$4.99',
			priceId: PUBLIC_PADDLE_MENS_DRAW_PRICE_ID,
			header: header,
			features: [
				"Access to make predictions for men's singles draw",
				'Earn points and a global ranking',
				'View all rankings, leaderboards, and stats'
			],
			messages: {
				[UserAccess.GRANDFATHERED]: grandfatheredMessage,
				[UserAccess.SUBSCRIPTION]: 'You already have access through your subscription.',
				[UserAccess.BOTH]: 'You already have access to both draws.',
				[UserAccess.MEN]: 'You already have access to this draw.',
				[UserAccess.WOMEN]: '',
				[UserAccess.NONE]: '',
				[UserAccess.LOGGED_OUT]: ''
			}
		},
		{
			title: "Women's Draw",
			plan: PlanName.WOMEN,
			price: '$4.99',
			priceId: PUBLIC_PADDLE_WOMENS_DRAW_PRICE_ID,
			header: header,
			features: [
				"Access to make predictions for women's singles draw",
				'Earn points and a global ranking',
				'View all rankings, leaderboards, and stats'
			],
			messages: {
				[UserAccess.GRANDFATHERED]: grandfatheredMessage,
				[UserAccess.SUBSCRIPTION]: 'You already have access through your subscription.',
				[UserAccess.BOTH]: 'You already have access to both draws.',
				[UserAccess.MEN]: '',
				[UserAccess.WOMEN]: 'You already have access to this draw.',
				[UserAccess.NONE]: '',
				[UserAccess.LOGGED_OUT]: ''
			}
		},
		{
			title: 'Both Draws',
			plan: PlanName.BOTH,
			price: '$7.99',
			priceId: PUBLIC_PADDLE_BOTH_DRAWS_PRICE_ID,
			header: header,
			features: [
				"Access to make predictions for men's and women's singles draws",
				'20% savings',
				'Earn points and a global ranking',
				'View all rankings, leaderboards, and stats'
			],
			messages: {
				[UserAccess.GRANDFATHERED]: grandfatheredMessage,
				[UserAccess.SUBSCRIPTION]: 'You already have access through your subscription.',
				[UserAccess.BOTH]: 'You already have access to both draws.',
				[UserAccess.MEN]:
					"You already have access to the men's draw. You may purchase the women's draw as well.",
				[UserAccess.WOMEN]:
					"You already have access to the women's draw. You may purchase the men's draw as well.",
				[UserAccess.NONE]: '',
				[UserAccess.LOGGED_OUT]: ''
			}
		},
		{
			title: 'Full Access Subscription',
			plan: PlanName.SUBSCRIPTION,
			price: '$19.99/yr',
			priceId: PUBLIC_PADDLE_SUBSCRIPTION_PRICE_ID,
			featured: true,
			features: [
				'Access to make predictions for all draws throughout the year',
				'50% savings',
				'One-time setup',
				'Earn points and a global ranking',
				'View all rankings, leaderboards, and stats'
			],
			messages: {
				[UserAccess.GRANDFATHERED]: grandfatheredMessage,
				[UserAccess.SUBSCRIPTION]: 'You already have an active subscription.',
				[UserAccess.BOTH]: '',
				[UserAccess.MEN]: '',
				[UserAccess.WOMEN]: '',
				[UserAccess.NONE]: '',
				[UserAccess.LOGGED_OUT]: ''
			}
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
				{@const disabled = option.messages[data.userAccess] !== '' && $isAuth}
				<div
					class="relative flex flex-col overflow-hidden rounded-lg border shadow-lg {option.featured
						? 'border-primary-500 ring-2 ring-primary-500'
						: 'border-gray-200'}"
				>
					{#if option.header}
						<div
							class="absolute w-full py-1 text-center text-sm font-semibold text-white {pricingHeaderStyleMap[
								mensDraw.name
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
							{#if disabled}
								<p class="my-4 text-center text-sm text-gray-500">
									{option.messages[data.userAccess]}
								</p>
							{/if}
							<button
								type="button"
								class="variant-filled-primary btn w-full"
								onclick={() => handleClick(option)}
								{disabled}
							>
								{option.featured ? 'Get Started' : 'Select'}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	{#if !$isAuth}
		<div>
			<p class="mt-6 text-center text-sm text-gray-500">
				You'll be prompted to create an account and then taken to the payment page.
			</p>
		</div>
	{/if}
</main>
