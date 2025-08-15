import type { BasePageData } from '$lib/types.js'

export async function load() {
	return {
		title: 'Create Account',
		description: 'Sign up for Racquet Rivals.'
	} as BasePageData
}
