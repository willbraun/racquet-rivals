import { errorMessage } from '$lib/utils'
import { error } from '@sveltejs/kit'
import type { ClientResponseError } from 'pocketbase'

export const fetchJson = async (url: string, svelteFetch: SvelteFetch, token?: string) => {
	const options: RequestInit = token
		? {
				headers: {
					Authorization: token
				}
			}
		: {}

	try {
		const response = await svelteFetch(url, options)
		const data = await response.json()

		return data
	} catch (e) {
		const statusCode = (e as ClientResponseError).status
		return error(statusCode, errorMessage(statusCode))
	}
}
