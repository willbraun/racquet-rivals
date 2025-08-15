import type { BasePageData } from '$lib/types.js'

export async function load() {
	return {
		title: 'Login',
		description: 'Log in to your Racquet Rivals account.'
	} as BasePageData
}
