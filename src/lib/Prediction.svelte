<script lang="ts">
	// import Pocketbase from 'pocketbase'
	export let name: string
	export let userId: string
	export let points: number

	console.log(userId) // remove once using userId
	// const pb = new Pocketbase('https://tennisbracket.willbraun.dev')
</script>

<div
	class="flex justify-between items-center border border-black rounded-full h-6 w-fit bg-white"
	class:border-dashed={!name}
	class:w-12={!name}
>
	<div class="">
		<p class="text-xs px-1">{name}</p>
	</div>
	{#if points}
		<div class="rounded-full aspect-square h-5 text-sm bg-green-400">
			<p>{points}</p>
		</div>
	{/if}
</div>
