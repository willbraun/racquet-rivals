import type { BasePageData } from '$lib/types.js'

export async function load() {
	return {
		title: 'About',
		description:
			'Learn about Racquet Rivals, the fantasy tennis community where you can predict match winners and compete with fellow fans.'
	} as BasePageData
}
