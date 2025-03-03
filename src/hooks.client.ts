import { pb } from '$lib/pocketbase'
import { currentUsername, currentUserId } from '$lib/store'

pb.authStore.loadFromCookie(document.cookie)
pb.authStore.onChange(() => {
	// TODO - update to this: currentUser.set(pb.authStore.record)
	currentUsername.set(pb.authStore.record?.username ?? '')
	currentUserId.set(pb.authStore.record?.id ?? '')
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
}, true)
