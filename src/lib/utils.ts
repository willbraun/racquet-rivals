import type { ClientResponseError } from 'pocketbase'

export const errorMessage = (error: unknown) => {
	const errorObj = error as ClientResponseError

	const result = `Error: ${errorObj.status} - ${errorObj.message}`
	console.error(result)
	return result
}
