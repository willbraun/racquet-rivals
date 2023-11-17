<script>
	import Pocketbase from 'pocketbase'
	import { errorMessage } from './utils'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Cookies from 'js-cookie'

	const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

	const pathname = $page.url.pathname

	const logout = () => {
		try {
			pb.authStore.clear()
			Cookies.remove('currentUser')
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
