<script>
	import { enhance } from '$app/forms'
	import { isAuth } from './store'
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
		<button type="submit" class="btn btn-sm md:btn-md variant-ghost rounded-lg">Logout</button>
	</a>
</form>
