<script>
	import { page } from '$app/state'
	import arrowLeft from '$lib/images/icons/arrow-left-solid.svg'
	import home from '$lib/images/icons/home.svg'

	const handleGoBack = () => {
		window.history.back()
	}
</script>

<main
	class="bg-primary-200 flex h-screen w-full flex-col items-center justify-center gap-8 text-center"
>
	<div class="bg-yellow-300 p-1 text-center text-sm font-medium">
		Hey, it's Will. Apologies for the error, please click the home icon to proceed.
		<br />
		<br />
		There were some issues in the backend and the link in your email may be incorrect, but the site should
		be working now. Thanks for your patience!
	</div>
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
