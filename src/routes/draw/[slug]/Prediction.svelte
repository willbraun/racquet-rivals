<script lang="ts">
	export let name: string
	export let points: number
	export let color: string
</script>

<div
	class={`relative chip pointer-events-none flex justify-between items-center rounded-full h-6 w-fit text-black ${color} shadow`}
>
	<div>
		<p class="text-xs">{name}</p>
	</div>
	{#if points}
		<div
			class="absolute badge-icon -top-1 -right-2 rounded-full aspect-square h-4 text-sm bg-green-400 z-10"
		>
			<p>{points}</p>
		</div>
	{/if}
</div>
