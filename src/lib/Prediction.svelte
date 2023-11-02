<script lang="ts">
	// import Pocketbase from 'pocketbase'
	export let name: string
	export let userId: string
	export let points: number

	console.log(userId) // clear once using userId
	// const pb = new Pocketbase('https://tennisbracket.willbraun.dev')
</script>

<div
	class="flex justify-between items-center border border-black rounded-full h-6 w-fit min-w-[50px] p-1 pr-0.5 bg-white"
	class:border-dashed={!name}
>
	<div class="">
		<p class="text-xs">{name}</p>
	</div>
	{#if points}
		<div class="rounded-full aspect-square h-5 text-sm ml-1 bg-green-400">
			<p>{points}</p>
		</div>
	{/if}
</div>
