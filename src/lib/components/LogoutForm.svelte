<script lang="ts">
	import { enhance } from '$app/forms'
	import { isAuth } from '$lib/store'
	import type { Snippet } from 'svelte'

	interface Props {
		children?: Snippet
	}

	let { children }: Props = $props()
</script>

<form
	action="/?/logout"
	method="POST"
	use:enhance={() => {
		return async ({ result, update }) => {
			await update()
			if (result.status === 200) {
				isAuth.set(false)
			}
		}
	}}
>
	<a href="#top">
		<!-- slot must have a button of type="submit" -->
		{@render children?.()}
	</a>
</form>
