import type { RootLayoutData } from '$lib/types'

export async function load({ locals }) {
	return {
		pb_auth_valid: locals.pb.authStore.isValid as boolean,
		pb_auth_cookie: locals.pb.authStore.exportToCookie() as string,
		pb_auth_username: (locals.pb.authStore.model?.username ?? '') as string
	} as RootLayoutData
}
