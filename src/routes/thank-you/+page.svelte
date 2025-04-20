<script lang="ts">
	import { page } from '$app/state'
	import Header from '$lib/components/Header.svelte'
	import { currentUser } from '$lib/store'
	import type { PlanName } from '$lib/types'
	import { onMount } from 'svelte'

	const plan = page.url.searchParams.get('plan') ?? 'none'
	onMount(() => {
		console.log('Selected plan from redirect:', plan)
		history.replaceState(null, '', '/thank-you')
	})

	const orderText: Record<PlanName | 'none', string> = {
		men: "Men's Draw order",
		women: "Women's Draw order",
		both: 'order of both draws',
		subscription: 'subscription order',
		none: 'order'
	}
</script>

<Header />
<main class="bg-stone-100">
	<div class="flex h-full flex-col items-center justify-center gap-8 py-24 text-center">
		<h1 class="text-4xl sm:text-7xl">{`Thank you ${$currentUser?.username}, you're in!`}</h1>
		<p>
			Your {orderText[plan]} has been successfully processed. You will receive a confirmation email shortly.
		</p>
		<button type="button" class="btn-primary variant-filled-primary btn">
			<a href="/">Return to Home</a>
		</button>
	</div>
</main>
