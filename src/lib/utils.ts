import type Client from 'pocketbase'
import type { ClientResponseError } from 'pocketbase'
import { isAuth, selectedUsers } from './store'
import type { Draw, PbListResponse, SelectedUser, SelectedUserNoColor } from './types'
import { format } from 'date-fns'
import { get } from 'svelte/store'

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
	const slugify = (str: string) => str.toLowerCase().replaceAll(' ', '-').replaceAll("'", '')
	return `${slugify(draw.name)}-${slugify(draw.event)}-${draw.year}-${draw.id}`
}

export const getTitle = (draw: Draw): string => {
	return `${draw.name} ${draw.event} ${draw.year}`
}

const getNextColor = (users: SelectedUser[]) => {
	return selectColors.filter((color) => !users.some((user) => user.color === color))[0]
}

export const addUser = (user: SelectedUserNoColor) => {
	const users = get(selectedUsers)
	const newUser = {
		...user,
		color: getNextColor(users)
	}
	selectedUsers.set([...users, newUser])
}

export const removeUser = (userId: string) => {
	const users = get(selectedUsers)
	selectedUsers.set(users.filter((u) => u.id !== userId))
}

export const mainColor = 'bg-blue-300'

export const selectColors = [
	'bg-red-300',
	'bg-yellow-300',
	'bg-green-300',
	'bg-purple-300',
	'bg-orange-300'
]

// server utils
export const fetchDraws = async (svelteFetch: SvelteFetch, url: string, token: string) => {
	const today = format(new Date(), 'yyyy-MM-dd')
	const options = {
		headers: {
			Authorization: token
		}
	}

	const activeRes = await svelteFetch(
		`${url}/api/collections/draw/records?filter=(end_date>="${today}")&sort=-start_date,event`,
		options
	)
	const activeData: PbListResponse<Draw> = await activeRes.json()

	const completedRes = await svelteFetch(
		`${url}/api/collections/draw/records?filter=(end_date<"${today}")&sort=-start_date,event`,
		options
	)
	const completedData: PbListResponse<Draw> = await completedRes.json()

	return [activeData, completedData]
}
