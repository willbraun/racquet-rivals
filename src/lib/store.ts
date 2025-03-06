import { derived, writable } from 'svelte/store'
import type { Prediction, SelectedUser, UserRecord } from '$lib/types'
import { persisted } from 'svelte-persisted-store'
import Cookies from 'js-cookie'

// Authentication
export const currentUser = writable<UserRecord | null>(null)
export const isAuth = derived(currentUser, ($currentUser) => {
	return !!$currentUser
})

isAuth.subscribe((value) => {
	if (value === false) {
		Cookies.remove('isLeaderboard')
	}
})
export const loginGoto = writable<string>('/')

// Selected users
export const selectedUsers = persisted<SelectedUser[]>('selectedUsers', [])
export const mySelectedUsers = derived(
	[selectedUsers, currentUser],
	([$selectedUsers, $currentUser]) => {
		return $selectedUsers.filter((user) => user.selectorId === $currentUser?.id)
	}
)
export const predictionStore = writable<Prediction[]>([])
export const predictionsError = writable<string>('')
predictionsError.subscribe((value) => {
	if (value) {
		console.error(value)
	}
})

// General
export const currentDrawId = writable<string>('')
export const drawNavUrl = writable<string>('')
export const isLeaderboard = writable<boolean>(false)
export const isMobile = writable<boolean>(false)
if (typeof window !== 'undefined') {
	const value = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0
	isMobile.set(value)
}
