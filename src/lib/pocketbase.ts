import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import Pocketbase from 'pocketbase'
import type { UserRecord } from './types'

// Create a single PocketBase instance for the client
export const pb = new Pocketbase(PUBLIC_POCKETBASE_URL)

// Initialize the auth store listener (call this after store is imported)
let initialized = false
export function initPocketbase() {
	if (initialized || typeof window === 'undefined') return
	initialized = true

	// Lazy import to avoid circular dependency
	import('./store').then(({ currentUser }) => {
		pb.authStore.onChange(() => {
			currentUser.set(pb.authStore.record as UserRecord)

			// Create encoded pb_auth cookie string and set it in the document, or remove it if logging out
			document.cookie = pb.authStore.exportToCookie({
				httpOnly: false // so it can be managed from the client in this file
			})
		}, true)
	})
}
