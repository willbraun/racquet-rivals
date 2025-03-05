import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import Pocketbase from 'pocketbase'
import Cookies from 'js-cookie'
import { currentUser } from './store'
import type { UserRecord } from './types'

// Create a single PocketBase instance for the client
export const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

// Load stored cookie if available (for browser environments)
if (typeof window !== 'undefined') {
	const storedAuth = Cookies.get('pb_auth')

	if (storedAuth) {
		pb.authStore.loadFromCookie(storedAuth)
	}
}

// Update the currentUser store when the authStore changes
pb.authStore.onChange(() => {
	console.log('authStore.onChange')
	currentUser.set(pb.authStore.record as UserRecord)
	const auth = pb.authStore.exportToCookie({ httpOnly: false })
	Cookies.set('pb_auth', auth, { secure: true, sameSite: 'strict' })
}, true)
