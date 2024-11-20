<script lang="ts">
	import goldMedal from '$lib/images/icons/goldmedal.png'
	import silverMedal from '$lib/images/icons/silvermedal.png'
	import bronzeMedal from '$lib/images/icons/bronzemedal.png'

	interface Props {
		rank: number | null
		containerStyle?: string
		textStyle?: string
	}

	let { rank, containerStyle = '', textStyle = '' }: Props = $props()
</script>

<div class={containerStyle}>
	{#if rank === 1}
		<img
			class="w-full rounded-full shadow"
			src={goldMedal}
			alt="gold medal"
			data-testid="gold-medal"
		/>
	{:else if rank === 2}
		<img
			class="w-full rounded-full shadow"
			src={silverMedal}
			alt="silver medal"
			data-testid="silver-medal"
		/>
	{:else if rank === 3}
		<img
			class="w-full rounded-full shadow"
			src={bronzeMedal}
			alt="bronze medal"
			data-testid="bronze-medal"
		/>
	{:else if rank === null}
		<p class={`text-center ${textStyle}`}>N/A</p>
	{:else}
		<p class={`text-center ${textStyle}`}>{rank}</p>
	{/if}
</div>
