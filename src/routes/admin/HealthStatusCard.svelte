<script lang="ts">
	import { ScraperHealth, type ScraperHealthCheck } from '$lib/types'
	import { format } from 'date-fns'
	import {
		scraperHealthColorMap,
		scraperHealthEmojiMap,
		scraperHealthSingleTextMap,
		scrapersHealthyWaitingErrors
	} from '../../lib/data'

	interface Props {
		title: string
		healthData: ScraperHealthCheck | null
	}

	let { title, healthData }: Props = $props()

	function formatDate(dateString: string): string {
		return format(new Date(dateString), 'MMM d, yyyy h:mm:ss a')
	}

	const isWaiting = scrapersHealthyWaitingErrors.some((err) => healthData?.error.includes(err))
	let status = $state<ScraperHealth>(ScraperHealth.SUCCESS)
	if (healthData) {
		if (healthData.error === '') {
			status = ScraperHealth.SUCCESS
		} else if (isWaiting) {
			status = ScraperHealth.WAITING
		} else {
			status = ScraperHealth.ERROR
		}
	}
</script>

<div class="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
	<h2 class="mb-4 text-2xl font-semibold sm:text-3xl">{title}</h2>
	{#if healthData}
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-3">
				<span class="text-lg font-medium sm:text-xl">Status:</span>
				<span
					class="rounded-full px-4 py-1 text-sm font-semibold sm:text-base {scraperHealthColorMap[
						status
					]}"
				>
					{scraperHealthEmojiMap[status]}
					{scraperHealthSingleTextMap[status]}
				</span>
			</div>
			<div class="flex flex-col gap-1">
				<span class="text-sm font-medium text-gray-600 sm:text-base">Last Check:</span>
				<span class="text-sm text-gray-800 sm:text-base">{formatDate(healthData.updated)}</span>
			</div>
			<div class="flex flex-col gap-1">
				<span class="text-sm font-medium text-gray-600 sm:text-base">Draw URL:</span>
				<a
					href={healthData.draw_url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm break-all text-blue-600 hover:underline sm:text-base"
				>
					{healthData.draw_url}
				</a>
			</div>
			{#if healthData.error}
				<div class="mt-2 flex flex-col gap-1">
					<p
						class="text-sm font-medium {status === ScraperHealth.ERROR
							? 'text-red-600'
							: ''} sm:text-base"
					>
						Error Details:
					</p>
					<p
						class="overflow-x-auto rounded p-3 font-mono text-sm break-words whitespace-pre-wrap {status ===
						ScraperHealth.ERROR
							? 'bg-red-50 text-red-900'
							: 'bg-yellow-100 text-yellow-800'} sm:text-base"
					>
						{healthData.error}
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<p class="text-gray-500 sm:text-lg">No health check data available</p>
	{/if}
</div>
