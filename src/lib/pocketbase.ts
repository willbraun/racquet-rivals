import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import Pocketbase from 'pocketbase'
import { currentUser } from './store'
import type { UserRecord } from './types'
import Cookies from 'js-cookie'

// Create a single PocketBase instance for the client
export const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

// Update the currentUser store when the authStore changes
if (typeof window !== 'undefined') {
	pb.authStore.onChange(() => {
		currentUser.set(pb.authStore.record as UserRecord)
		const cookieValue = pb.authStore
			.exportToCookie({ httpOnly: false, secure: false, sameSite: 'lax' })
			.split('=')[1]
		Cookies.set('pb_auth', cookieValue)
	}, true)
}
