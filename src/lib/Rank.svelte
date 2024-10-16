<script lang="ts">
	import goldMedal from '$lib/images/icons/goldmedal.png'
	import silverMedal from '$lib/images/icons/silvermedal.png'
	import bronzeMedal from '$lib/images/icons/bronzemedal.png'

	export let rank: number
	export let textStyle: string
	export let medalWidth: number
</script>

{#if rank === 1}
	<img class="rounded-full shadow" src={goldMedal} alt="gold medal" width={medalWidth} />
{:else if rank === 2}
	<img class="rounded-full shadow" src={silverMedal} alt="silver medal" width={medalWidth} />
{:else if rank === 3}
	<img class="rounded-full shadow" src={bronzeMedal} alt="bronze medal" width={medalWidth} />
{:else}
	<p class={textStyle}>{rank}</p>
{/if}
