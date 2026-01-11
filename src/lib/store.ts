import type { Prediction, PredictionDistribution, SelectedUser, Slot, UserRecord } from '$lib/types'
import Cookies from 'js-cookie'
import { persisted } from 'svelte-persisted-store'
import { derived, writable } from 'svelte/store'
import { logErrorInDev } from './utils'

// Authentication
export const currentUser = writable<UserRecord | null>(null)
export const isAuth = derived(currentUser, ($currentUser) => {
	return !!$currentUser
})
export const isAdmin = derived(currentUser, ($currentUser) => {
	return $currentUser?.role === 'admin'
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

// Predictions
export const predictionStore = writable<Prediction[]>([])
export const predictionsError = writable<string>('')
predictionsError.subscribe((value) => {
	if (value) {
		logErrorInDev(value)
	}
})
export const predictionDistributionStore = writable<PredictionDistribution[]>([])
export const predictionDistributionError = writable<string>('')
predictionDistributionError.subscribe((value) => {
	if (value) {
		logErrorInDev(value)
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
export const scrapersHealthy = writable<boolean>(true)

// Modal/Drawer state
export const selectUsersModalOpen = writable<boolean>(false)
export const shareLinkOpen = writable<boolean>(false)
export const navMenuOpen = writable<boolean>(false)
export const slotStatsOpen = writable<Slot | null>(null)
