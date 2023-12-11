import { writable } from 'svelte/store'
import type { Prediction } from '$lib/types'

export const isAuth = writable<boolean>()
export const predictionStore = writable<Prediction[]>([])
