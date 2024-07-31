import { writable } from 'svelte/store'
import type { Prediction, SelectedUser } from '$lib/types'
import { persisted } from 'svelte-persisted-store'
import Cookies from 'js-cookie'

export const isAuth = writable<boolean>()
isAuth.subscribe((value) => {
	if (value === false) {
		Cookies.remove('isLeaderboard')
	}
})

export const predictionStore = writable<Prediction[]>([])
export const selectedUsers = persisted<SelectedUser[]>('selectedUsers', [])
export const isLeaderboard = writable<boolean>(false)
