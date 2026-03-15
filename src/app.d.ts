// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import Pocketbase from 'pocketbase'

declare global {
	declare namespace App {
		interface Locals {
			pb: Pocketbase
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

// Extend the Window interface to include the cloudflare turnstile object that is loaded via a script tag in app.html. This allows us to use the turnstile object in our Svelte components without TypeScript errors.
declare global {
	interface Window {
		turnstile: {
			render: (
				container: string | HTMLElement,
				options: {
					sitekey: string
					callback?: (token: string) => void
					[key: string]: unknown
					'error-callback'?: (errorCode: number) => void
				}
			) => string
			remove: (widgetId: string) => void
			reset: (widgetId: string) => void
			getResponse: (widgetId: string) => string | undefined
			isExpired: (widgetId: string) => boolean
		}
	}
}
