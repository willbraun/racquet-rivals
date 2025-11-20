<script lang="ts">
	import x from '$lib/images/icons/x.svg'
	import { Chart } from 'chart.js/auto'
	import { onMount } from 'svelte'
	import { predictionDistributionStore, slotStatsOpen } from '../store'
	import { IsCorrect } from '../types'

	let round = $derived($slotStatsOpen?.round ?? 0)
	let position = $derived($slotStatsOpen?.position ?? 0)
	let name = $derived($slotStatsOpen?.name ?? '')
	let seed = $derived($slotStatsOpen?.seed ?? '')

	let winningIcon = $derived(round === 8 ? '🏆' : '✅')
	let chartData = $derived.by(() => {
		const distributions = $predictionDistributionStore
			.filter((item) => item.draw_slot_id === $slotStatsOpen?.id)
			.sort((a, b) => b.name_count - a.name_count)

		const labels = distributions.map((d) => d.name)
		const values = distributions.map((d) => d.name_count)

		let winningArcIndex = -1

		// Predictions have been made but no winner yet
		if (!name) {
			return {
				labels,
				values,
				winningArcIndex
			}
		}

		// Find the arc index of the winner
		const naiveIndex = distributions.map((d) => d.is_correct).indexOf(IsCorrect.CORRECT)
		if (naiveIndex === -1) {
			// Nobody predicted the winner, so add a new arc of size 0
			labels.push(`${seed} ${name} ${winningIcon}`)
			values.push(0)
			winningArcIndex = labels.length - 1
		} else {
			labels[naiveIndex] = `${labels[naiveIndex]} ${winningIcon}`
			winningArcIndex = naiveIndex
		}

		return {
			labels,
			values,
			winningArcIndex
		}
	})

	const roundMap: Record<number, string> = {
		5: 'Quarterfinalist',
		6: 'Semifinalist',
		7: 'Finalist',
		8: 'Champion'
	}

	let canvasEl: HTMLCanvasElement
	let chart: Chart

	const isWinningArc = (dataIndex: number) => dataIndex === chartData.winningArcIndex
	const getArcBorderWidth = (dataIndex: number) => (isWinningArc(dataIndex) ? 4 : 2)
	const getArcBorderColor = (dataIndex: number) => (isWinningArc(dataIndex) ? '#000' : '#fff')

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
				maintainAspectRatio: true,
				plugins: {
					legend: {
						labels: {
							font: {
								size: 18
							}
						}
					},
					tooltip: {
						titleFont: {
							size: 18
						},
						bodyFont: {
							size: 18
						}
					}
				},
				elements: {
					arc: {
						borderWidth: (context) => getArcBorderWidth(context.dataIndex),
						borderColor: (context) => getArcBorderColor(context.dataIndex)
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
			chart.options.elements!.arc!.borderWidth = (context) => getArcBorderWidth(context.dataIndex)
			chart.options.elements!.arc!.borderColor = (context) => getArcBorderColor(context.dataIndex)
			chart.update()
		}
	})
</script>

<div class="flex h-full w-full flex-col items-center justify-between gap-4 bg-white">
	<div class="relative w-full bg-stone-200 text-center shadow">
		<p class="p-2 text-xl font-bold">
			{roundMap[round] || 'Unknown round'}
			{round !== 8 ? `#${position}` : ''}
		</p>
		<button
			onclick={() => slotStatsOpen.set(null)}
			class="absolute top-0 top-1/2 right-4 -translate-y-1/2"
		>
			<img src={x} alt="close" width="24" />
		</button>
	</div>
	<canvas class="my-auto overflow-y-auto sm:p-4" bind:this={canvasEl}></canvas>
</div>
