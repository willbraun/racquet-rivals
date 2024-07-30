import { writable } from 'svelte/store'
import type { Prediction, SelectedUser } from '$lib/types'
import { persisted } from 'svelte-persisted-store'

export const isAuth = writable<boolean>()
export const predictionStore = writable<Prediction[]>([])
export const selectedUsers = persisted<SelectedUser[]>('selectedUsers', [])
export const isLeaderboard = writable<boolean>(false)
