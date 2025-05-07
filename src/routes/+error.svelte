<script>
	import { page } from '$app/state'
	import arrowLeft from '$lib/images/icons/arrow-left-solid.svg'
	import home from '$lib/images/icons/home.svg'

	const handleGoBack = () => {
		window.history.back()
	}
</script>

<main
	class="flex h-screen w-full flex-col items-center justify-center gap-8 bg-primary-300 text-center"
>
	<h1 class="text-7xl font-bold">Error</h1>
	<p class="text-4xl">{page.status}: {page?.error?.message}</p>
	<div class="flex items-center gap-16">
		<button onclick={handleGoBack} class="">
			<img src={arrowLeft} alt="home" width="32" data-testid="home-icon" />
		</button>
		<a class="" href="/">
			<img src={home} alt="home" width="32" data-testid="home-icon" />
		</a>
	</div>
</main>
