import type { BasePageData } from '$lib/types.js'

export async function load() {
	return {
		title: 'Reset Password',
		description: 'Reset your Racquet Rivals account password.'
	} as BasePageData
}
