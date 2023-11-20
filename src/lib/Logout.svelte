<script>
	import Pocketbase from 'pocketbase'
	import { errorMessage } from './utils'
	import Cookies from 'js-cookie'

	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	const logout = () => {
		try {
			pb.authStore.clear()
			Cookies.remove('currentUser')
			Cookies.remove('pb_auth')
			location.reload()
		} catch (e) {
			errorMessage(e)
		}
	}
</script>

<form on:submit={logout}>
	<a data-sveltekit-reload href="#top">
		<button type="submit" class="btn btn-sm md:btn-md variant-ghost rounded-lg">Logout</button>
	</a>
</form>
