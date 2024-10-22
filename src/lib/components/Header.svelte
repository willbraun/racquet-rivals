<script>
	import home from '$lib/images/icons/home.svg'
	import NavMenu from '$lib/components/NavMenu.svelte'

	export let color = 'bg-stone-100'
</script>

<header class="flex items-start gap-4 {color} px-4 py-4">
	<a class="mr-auto flex flex-shrink-0 items-center justify-center px-2 py-1" href="/">
		<img src={home} alt="home" width="24" />
	</a>
	<slot />
	<NavMenu />
</header>
