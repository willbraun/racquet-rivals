<script>
	import { page } from '$app/stores'
</script>

<main
	class="flex h-screen w-full flex-col items-center justify-center gap-8 bg-primary-300 text-center"
>
	<h1 class="text-7xl font-semibold">Error</h1>
	<p class="text-4xl">{$page.status}: {$page?.error?.message}</p>
</main>
