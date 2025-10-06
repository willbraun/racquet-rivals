<script lang="ts">
	import { goto } from '$app/navigation'
	import { pb } from '$lib/pocketbase'
	import Cookies from 'js-cookie'
	import type { Snippet } from 'svelte'

	interface Props {
		styles?: string
		children?: Snippet
		onLogout?: () => void
	}

	let { styles, children, onLogout }: Props = $props()

	const handleLogout = () => {
		pb.authStore.clear()
		Cookies.remove('isLeaderboard')

		if (onLogout) {
			onLogout()
		}

		// Redirect must be done after clearing the auth store to pass the
		// updated pb.authStore to the server via hooks
		goto('/')
	}
</script>

<button
	onclick={handleLogout}
	onkeydown={(e) => e.key === 'Enter' && handleLogout()}
	type="button"
	tabindex="0"
	class={styles}
>
	{@render children?.()}
</button>
