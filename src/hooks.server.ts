import PocketBase from 'pocketbase'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.pb = new PocketBase('https://tennisbracket.willbraun.dev')

	// load the store data from the request cookie string
	console.log('1', event.request.headers.get('cookie'))
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
	console.log('2', event.locals.pb.authStore)

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		await event.locals.pb.collection('user').authRefresh()
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear()
	}

	const response = await resolve(event)

	// send back the default 'pb_auth' cookie to the client with the latest store state
	// response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({httpOnly: false}, 'pb_auth'))

	return response
}
