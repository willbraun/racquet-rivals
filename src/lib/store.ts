import { writable, type Writable } from 'svelte/store'
import type { Draw, Prediction } from '$lib/types'
import { localStorageStore } from '@skeletonlabs/skeleton'

export const isAuth = writable<boolean>()
export const activeDraws: Writable<Draw[]> = localStorageStore('activeDraws', [])
export const completedDraws: Writable<Draw[]> = localStorageStore('completedDraws', [])
export const predictionStore = writable<Prediction[]>([])
