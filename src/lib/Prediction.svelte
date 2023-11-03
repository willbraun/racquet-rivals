<script lang="ts">
	export let name: string
	export let userId: string
	export let points: number

	console.log(userId) // remove once using userId
</script>

<div
	class="chip relative variant-filled flex justify-between items-center border border-black rounded-full h-6 w-fit"
	class:border-dashed={!name}
	class:w-12={!name}
>
	<div class="">
		<p class="text-xs">{name}</p>
	</div>
	{#if points}
		<div
			class="absolute badge-icon -top-1 -right-2 rounded-full aspect-square h-4 text-sm bg-green-500"
		>
			<p>{points}</p>
		</div>
	{/if}
</div>
