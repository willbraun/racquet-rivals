<script lang="ts">
	import goldMedal from '$lib/images/icons/goldmedal.png'
	import silverMedal from '$lib/images/icons/silvermedal.png'
	import bronzeMedal from '$lib/images/icons/bronzemedal.png'

	export let rank: number
	export let containerStyle: string
	export let textStyle: string
</script>

<div class={containerStyle}>
	{#if rank === 1}
		<img class="w-full rounded-full shadow" src={goldMedal} alt="gold medal" />
	{:else if rank === 2}
		<img class="w-full rounded-full shadow" src={silverMedal} alt="silver medal" />
	{:else if rank === 3}
		<img class="w-full rounded-full shadow" src={bronzeMedal} alt="bronze medal" />
	{:else}
		<p class={`text-center ${textStyle}`}>{rank}</p>
	{/if}
</div>
