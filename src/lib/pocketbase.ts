import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import Pocketbase from 'pocketbase'
import Cookies from 'js-cookie'

// Create a single PocketBase instance for the client
export const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

// Load stored cookie if available (for browser environments)
if (typeof window !== 'undefined') {
	const storedAuth = Cookies.get('pb_auth')

	if (storedAuth) {
		pb.authStore.loadFromCookie(storedAuth)
	}
}
