<script>
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
</script>

<form
	action="/login?/logout"
	method="POST"
	use:enhance={() => {
		return async ({ result, update }) => {
			await update()
			if (result.status === 200) {
				goto('/')
			}
		}
	}}
>
	<a data-sveltekit-reload href="/">
		<button type="submit" class="btn variant-ghost rounded-xl">Logout</button>
	</a>
</form>
