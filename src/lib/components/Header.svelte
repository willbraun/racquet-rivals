<script lang="ts">
	import { page } from '$app/state'
	import NavMenu from '$lib/components/NavMenu.svelte'
	import home from '$lib/images/icons/home.svg'
	import type { Snippet } from 'svelte'

	interface Props {
		twClass?: string
		color?: string
		children?: Snippet
	}

	let { twClass, color = 'bg-stone-100', children }: Props = $props()

	const isInverted = page.url.pathname === '/'
</script>

<header class="flex items-start gap-4 {twClass} {color} w-full p-4">
	<a class="mr-auto flex shrink-0 items-center justify-center px-2 py-1" href="/">
		<img src={home} alt="home" width="24" data-testid="home-icon" class:invert={isInverted} />
	</a>
	{@render children?.()}
	<NavMenu {isInverted} />
</header>
