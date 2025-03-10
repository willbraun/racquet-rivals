import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import Pocketbase from 'pocketbase'
import { currentUser } from './store'
import type { UserRecord } from './types'

// Create a single PocketBase instance for the client
export const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

// Update the currentUser store when the authStore changes
if (typeof window !== 'undefined') {
	pb.authStore.onChange(() => {
		currentUser.set(pb.authStore.record as UserRecord)

		// Create encoded pb_auth cookie string and set it in the document, or remove it if logging out
		document.cookie = pb.authStore.exportToCookie({
			httpOnly: false // so it can be managed from the client in this file
		})
	}, true)
}
