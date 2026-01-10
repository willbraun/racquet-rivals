<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import type { AdminPageData } from '$lib/types'
	import HealthStatusCard from './HealthStatusCard.svelte'

	let { data }: { data: AdminPageData } = $props()
</script>

<Header />
<main class="bg-stone-100">
	<div class="mx-auto px-4 pb-16">
		<h1 class="mb-8 text-4xl font-bold sm:text-6xl">Admin</h1>

		<h2 class="mb-4 text-2xl font-semibold">Scraper Health Status</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<HealthStatusCard title="ATP Draw" healthData={data.atpHealth} />
			<HealthStatusCard title="WTA Draw" healthData={data.wtaHealth} />
		</div>
	</div>
</main>
