<script>
	import Pocketbase from 'pocketbase'
	import { errorMessage } from './utils'
	import Cookies from 'js-cookie'
	import { applyAction, enhance } from '$app/forms'
	import { goto } from '$app/navigation'

	// const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	// const logout = () => {
	// 	try {
	// 		pb.authStore.clear()
	// 		Cookies.remove('currentUser')
	// 		Cookies.remove('pb_auth')
	// 		location.reload()
	// 	} catch (e) {
	// 		errorMessage(e)
	// 	}
	// }
</script>

<!-- <form on:submit={logout}> -->
	<form
	action="/login?/logout"
	method="POST"
	use:enhance={() => {
		return async ({ result, update }) => {
			await applyAction(result)
			await update()
			if (result.status === 200) {
				location.reload()
				goto('/')
			}
		}
	}}
>
	<a data-sveltekit-reload href="/">
		<button type="submit" class="btn btn-sm md:btn-md variant-ghost rounded-lg">Logout</button>
	</a>
</form>
