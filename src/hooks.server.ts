import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase from 'pocketbase'

// This hook is executed on every request to the SvelteKit server (every page navigation).
// It refreshes the user's auth and sends back the updated auth cookie to the client.
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// create SvelteKit local representing pocketbase client
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL)

	console.log('hook cookie', event.request.headers.get('cookie'))

	// load the store data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

	console.log('hook authStore', event.locals.pb.authStore.record)

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('user').authRefresh())
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear()
	}

	// pass the request
	const response = await resolve(event)

	console.log('handle.server response', event.locals.pb.authStore.exportToCookie())

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({
			secure: false, // set to false if testing on phone
			sameSite: 'lax', // set to false if testing on phone
			httpOnly: false
		})
	)

	return response
}
