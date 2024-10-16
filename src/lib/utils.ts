import type Client from 'pocketbase'
import type { ClientResponseError } from 'pocketbase'
import { isAuth, selectedUsers } from './store'
import type { Draw, DrawResult, PbListResponse, SelectedUser, SelectedUserNoColor } from './types'
import { format } from 'date-fns'
import { get } from 'svelte/store'
import Cookies from 'js-cookie'

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

const isDraw = (draw: Draw | DrawResult): draw is Draw => {
	return draw.collectionName === 'draw'
}

const isDrawResult = (draw: Draw | DrawResult): draw is DrawResult => {
	return draw.collectionName === 'draw_results'
}

export const getSlug = (draw: Draw | DrawResult): string => {
	const slugify = (str: string) => str.toLowerCase().replaceAll(' ', '-').replaceAll("'", '')

	if (isDraw(draw)) {
		return `${slugify(draw.name)}-${slugify(draw.event)}-${draw.year}-${draw.id}`
	} else if (isDrawResult(draw)) {
		return `${slugify(draw.draw_name)}-${slugify(draw.draw_event)}-${draw.draw_year}-${draw.draw_id}`
	} else {
		return ''
	}
}

export const getTitle = (draw: Draw | DrawResult): string => {
	if (isDraw(draw)) {
		return `${draw.name} ${draw.event} ${draw.year}`
	} else if (isDrawResult(draw)) {
		return `${draw.draw_name} ${draw.draw_event} ${draw.draw_year}`
	} else {
		return ''
	}
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
	const newUsers = [...users, newUser]
	selectedUsers.set(newUsers)
	Cookies.set('selectedUsers', JSON.stringify(newUsers))
}

export const removeUser = (userId: string) => {
	const users = get(selectedUsers)
	const newUsers = users.filter((u) => u.id !== userId)
	selectedUsers.set(newUsers)
	Cookies.set('selectedUsers', JSON.stringify(newUsers))
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
