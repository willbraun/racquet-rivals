<script>
	import { enhance } from '$app/forms'
</script>

<form
	action="/login?/logout"
	method="POST"
	use:enhance={() => {
		return async ({ update }) => {
			await update()
		}
	}}
>
	<a data-sveltekit-reload href="#top">
		<button type="submit" class="btn btn-sm md:btn-md variant-ghost rounded-lg">Logout</button>
	</a>
</form>
