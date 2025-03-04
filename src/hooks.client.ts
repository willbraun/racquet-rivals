import { pb } from '$lib/pocketbase'
import { currentUser } from '$lib/store'
import type { UserRecord } from '$lib/types'

pb.authStore.loadFromCookie(document.cookie)
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.record as UserRecord)
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
}, true)
