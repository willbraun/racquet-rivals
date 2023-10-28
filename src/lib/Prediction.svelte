<script lang="ts">
	import Pocketbase from 'pocketbase'
	// passing in SOME PREDICTION table values, as necessary
	export let name: string
	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')
</script>

<div
	class="relative flex items-center border border-black rounded-full h-6 min-w-[50px] p-2"
	class:border-dashed={!name}
>
	<p class="text-xs">{name}</p>

	<!-- <div class="absolute top-0 left-1/2 border border-black rounded-full h-full w-full text-sm">
    <p>+1</p>
  </div> -->
</div>
