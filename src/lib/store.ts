import { writable } from 'svelte/store'
import type { Prediction } from '../routes/draw/[slug]/+page.server'

export const predictionStore = writable<Prediction[]>([])
