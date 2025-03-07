<script lang="ts">
	import { pb } from '$lib/pocketbase'
	import type { Snippet } from 'svelte'
	import Cookies from 'js-cookie'
	import { goto } from '$app/navigation'

	interface Props {
		children?: Snippet
		onLogout?: () => void
	}

	let { children, onLogout }: Props = $props()

	const handleLogout = () => {
		pb.authStore.clear()
		Cookies.remove('pb_auth')
		Cookies.remove('isLeaderboard')

		if (onLogout) {
			onLogout()
		}

		goto('/')
	}
</script>

<button
	onclick={handleLogout}
	onkeydown={(e) => e.key === 'Enter' && handleLogout()}
	type="button"
	tabindex="0"
>
	{@render children?.()}
</button>
