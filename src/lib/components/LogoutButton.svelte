<script lang="ts">
	import { pb } from '$lib/pocketbase'
	import type { Snippet } from 'svelte'
	import Cookies from 'js-cookie'
	import { currentUser } from '$lib/store'

	interface Props {
		children?: Snippet
		onLogout?: () => void
	}

	let { children, onLogout }: Props = $props()

	const handleLogout = () => {
		pb.authStore.clear()
		currentUser.set(null)
		Cookies.remove('isLeaderboard')

		if (onLogout) {
			onLogout()
		}
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
