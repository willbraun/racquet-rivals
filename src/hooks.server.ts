import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase from 'pocketbase'

// This hook is executed on every request to the SvelteKit server (every page navigation).
// It refreshes the user's auth and sends back the updated auth cookie to the client.
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// create SvelteKit local representing pocketbase client
	event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL)

	// load the store data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('user').authRefresh())
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear()
	}

	// pass the request
	const response = await resolve(event)

	// Add CSP headers for Paddle integration
	response.headers.set(
		'Content-Security-Policy',
		"frame-ancestors 'self' http://localhost:* https://checkout.paddle.com https://sandbox-checkout.paddle.com https://*.paddle.com"
	)

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({
			httpOnly: false, // so it can be cleared from a client logout
			secure: true, // set to false if testing on phone
			sameSite: true // set to false if testing on phone
		})
	)

	return response
}
