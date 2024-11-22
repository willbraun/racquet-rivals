<script lang="ts">
	import home from '$lib/images/icons/home.svg'
	import NavMenu from '$lib/components/NavMenu.svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		color?: string
		children?: Snippet
	}

	let { color = 'bg-stone-100', children }: Props = $props()
</script>

<header class="flex items-start gap-4 {color} px-4 py-4">
	<a class="mr-auto flex flex-shrink-0 items-center justify-center px-2 py-1" href="/">
		<img src={home} alt="home" width="24" data-testid="home-icon" />
	</a>
	{@render children?.()}
	<NavMenu />
</header>
