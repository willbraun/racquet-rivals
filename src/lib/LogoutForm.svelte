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
		<!-- slot must have a button of type="submit" -->
		<slot />
	</a>
</form>
