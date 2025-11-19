<script lang="ts">
	import { Chart } from 'chart.js/auto'
	import { onMount } from 'svelte'
	import { predictionDistributionStore, slotStatsOpen } from '../store'

	let round = $derived($slotStatsOpen?.round ?? 0)
	let position = $derived($slotStatsOpen?.position ?? 0)
	let name = $derived($slotStatsOpen?.name ?? 'Unknown')

	let chartData = $derived.by(() => {
		const distributions = $predictionDistributionStore.filter(
			(item) => item.draw_slot_id === $slotStatsOpen?.id
		)

		return {
			labels: distributions.map((d) => d.name),
			values: distributions.map((d) => d.name_count)
		}
	})

	let winningIcon = $derived(round === 8 ? '🏆' : '✅')
	let winningArcIndex = $derived.by(() => {
		const naiveIndex = chartData.labels.findIndex((label) => label.includes(name))
		if (naiveIndex === -1) {
			chartData.labels.push(`${name} ${winningIcon}`)
			chartData.values.push(0)
			return chartData.labels.length - 1
		}

		chartData.labels[naiveIndex] = `${chartData.labels[naiveIndex]} ${winningIcon}`
		return naiveIndex
	})

	const roundMap: Record<number, string> = {
		5: 'Round of 16',
		6: 'Quarterfinal',
		7: 'Semifinal',
		8: 'Final'
	}

	let canvasEl: HTMLCanvasElement
	let chart: Chart

	// Initialize chart on mount
	onMount(() => {
		chart = new Chart(canvasEl, {
			type: 'pie',
			data: {
				labels: chartData.labels,
				datasets: [
					{
						label: 'Predictions',
						data: chartData.values,
						backgroundColor: [
							'#36A2EB', // Blue
							'#FF6384', // Pink
							'#FFCE56', // Yellow
							'#4BC0C0', // Teal
							'#9966FF', // Purple
							'#FF9F40', // Orange
							'#E91E63', // Deep Pink
							'#8BC34A', // Light Green
							'#4DC9F6', // Light Blue
							'#F67019', // Dark Orange
							'#F53794', // Magenta
							'#537BC4', // Navy Blue
							'#ACC236', // Lime
							'#166A8F', // Dark Teal
							'#00A950', // Green
							'#795548' // Brown
						]
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				elements: {
					arc: {
						borderWidth: (context) => {
							return context.dataIndex === winningArcIndex ? 4 : 2
						},
						borderColor: (context) => {
							return context.dataIndex === winningArcIndex ? '#000' : '#fff'
						}
					}
				}
			}
		})

		return () => chart.destroy()
	})

	// Update chart when chartData changes
	$effect(() => {
		if (chart) {
			chart.data.labels = chartData.labels
			chart.data.datasets[0].data = chartData.values
			chart.update()
		}
	})
</script>

<div class="flex h-full w-full flex-col items-center gap-8 bg-white p-8">
	<h2 class="text-xl font-semibold">
		{roundMap[round] || 'Unknown round'}
		{round !== 8 ? `#${position}` : ''}
	</h2>
	<canvas bind:this={canvasEl}></canvas>
</div>
