<script lang="ts">
	import { page } from '$app/state'
	import Header from '$lib/components/Header.svelte'
	import { currentUser } from '$lib/store'
	import { PlanName, TournamentName } from '$lib/types'
	import { capitalize } from '$lib/utils'
	import { onMount } from 'svelte'
	import { drawColorMap } from '$lib/data'
	import { replaceState } from '$app/navigation'

	const plan = page.url.searchParams.get('plan') ?? 'none'
	const mensDrawSlug = page.url.searchParams.get('mensDrawSlug') ?? ''
	const womensDrawSlug = page.url.searchParams.get('womensDrawSlug') ?? ''
	onMount(() => {
		replaceState('/thank-you', page.state)
	})

	const slugToTitle = (str: string) => {
		const result = str
			.replace(/-/g, ' ')
			.split(' ')
			.map((word) => capitalize(word))
			.slice(0, -1)
			.join(' ')
			.replace('ens', "en's")

		if (result.startsWith('Us Open')) {
			return result.replace('Us Open', 'US Open')
		}

		return result
	}

	const mensDrawTitle = slugToTitle(mensDrawSlug)
	const womensDrawTitle = slugToTitle(womensDrawSlug)
	const tournament = mensDrawTitle.split(' ').slice(0, -3).join(' ') as TournamentName
	const color = drawColorMap[tournament] || 'bg-primary-500'
	const orderText: Record<PlanName | 'none', string> = {
		men: "Men's Draw order",
		women: "Women's Draw order",
		both: 'order of both draws',
		subscription: 'subscription order',
		none: 'order'
	}

	const showMensDraw = [PlanName.MEN, PlanName.BOTH, PlanName.SUBSCRIPTION].includes(plan)
	const showWomensDraw = [PlanName.WOMEN, PlanName.BOTH, PlanName.SUBSCRIPTION].includes(plan)
</script>

<Header />
<main class="h-svh bg-stone-100">
	<div class="flex h-full flex-col items-center justify-center gap-8 px-8 pb-48 pt-24 text-center">
		<h1 class="text-4xl font-semibold sm:text-7xl">
			{`Thank you ${$currentUser?.username}, you're in!`}
		</h1>
		<p>
			Your {orderText[plan]} has been successfully processed. You will receive a confirmation email shortly.
		</p>
		<div class="flex max-w-xl flex-col items-center justify-center gap-4">
			{#if showMensDraw}
				<button class="w-full shadow-sm">
					<a
						href="/draw/{mensDrawSlug}"
						class="btn-primary text-wrap font-semibold text-white sm:text-xl {color} btn w-full"
					>
						{`Continue to ${mensDrawTitle}`}
					</a>
				</button>
			{/if}
			{#if showWomensDraw}
				<button class="w-full shadow-sm">
					<a
						href="/draw/{womensDrawSlug}"
						class="btn-primary text-wrap font-semibold text-white sm:text-xl {color} btn w-full"
					>
						{`Continue to ${womensDrawTitle}`}
					</a>
				</button>
			{/if}
		</div>
	</div>
</main>
