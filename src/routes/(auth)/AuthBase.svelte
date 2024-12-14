<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
	}

	let { children }: Props = $props()
</script>

<main class="absolute top-0 h-screen w-full bg-white md:bg-stone-100">
	<div class="mx-auto mt-24 max-w-md rounded-xl p-4 md:bg-white md:p-8 md:shadow-xl">
		{@render children()}
	</div>
</main>
