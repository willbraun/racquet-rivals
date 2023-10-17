import type { ClientResponseError } from 'pocketbase'

type ErrorObjData = {
	[key: string]: {
		code: string
		message: string
	}
}

export const errorMessage = (error: unknown) => {
	const errorObj = error as ClientResponseError
	const data = errorObj.data.data as ErrorObjData
	let dataMessage = ''

	if (Object.keys(data).length > 0) {
		dataMessage = Object.entries(data)
			.map(([key, value]) => `• ${capitalize(key)}: ${value.message}`)
			.join('\n')
	}

	const result = `Error: ${errorObj.status} - ${errorObj.message}${
		dataMessage && `\n${dataMessage}`
	}`
	console.error(result)
	return result
}

const capitalize = (str: string) => {
	if (!str) return ''
	return str[0].toUpperCase() + str.slice(1).toLowerCase()
}
