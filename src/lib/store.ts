import { writable } from 'svelte/store'
import type { RecordModel } from 'pocketbase'

export const currentUser = writable<RecordModel>()

export const emptyUser = {} as RecordModel
