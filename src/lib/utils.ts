import type Client from 'pocketbase'
import type { ClientResponseError } from 'pocketbase'
import { isAuth } from './store'
import type { Draw } from './types'

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

export const updatePageAuth = (pb: Client, serverPbValid: boolean, serverPbCookie: string) => {
	if (serverPbValid) {
		pb.authStore.loadFromCookie(serverPbCookie)
	} else {
		pb.authStore.clear()
	}
	isAuth.set(pb.authStore.isValid)
}

export const makeSetType = <T>() => {
	return (result: object): T => {
		return result as T
	}
}

export const getSlug = (draw: Draw): string => {
	const slugify = (str: string) => str.toLowerCase().replaceAll(' ', '-')
	return `${slugify(draw.name)}-${slugify(draw.event)}-${draw.year}-${draw.id}`
}

export const getTitle = (draw: Draw): string => {
	return `${draw.name} ${draw.event} ${draw.year}`
}

export const mainColor = 'bg-blue-300'

export const selectColors = [
	'bg-red-300',
	'bg-yellow-300',
	'bg-green-300',
	'bg-purple-300',
	'bg-orange-300'
]
