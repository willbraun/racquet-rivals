import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { currentUserId, selectedUsers } from './store'
import { addUser, removeUser } from './utils'
import { get } from 'svelte/store'

const testSelectedUsers = [
	{
		selectorId: 'willId',
		id: 'userId1',
		username: 'john',
		color: 'bg-red-300'
	},
	{
		selectorId: 'willId',
		id: 'userId2',
		username: 'steve',
		color: 'bg-yellow-300'
	},
	{
		selectorId: 'willId',
		id: 'userId3',
		username: 'sally',
		color: 'bg-green-300'
	}
]

describe('addUser', () => {
	test('Same current user, color is correct', () => {
		currentUserId.set('willId')
		selectedUsers.set(testSelectedUsers)

		addUser({
			selectorId: 'willId',
			id: 'userId4',
			username: 'bob'
		})

		const users = get(selectedUsers)
		expect(users).toHaveLength(4)
		expect(users[3].username).toBe('bob')
		expect(users[3].id).toBe('userId4')
		expect(users[3].color).toBe('bg-purple-300')
		expect(users[3].selectorId).toBe('willId')
	})

	test('Different current user, color is correct', () => {
		currentUserId.set('jamesId')
		selectedUsers.set(testSelectedUsers)

		addUser({
			selectorId: 'jamesId',
			id: 'userId4',
			username: 'bob'
		})

		const users = get(selectedUsers)
		expect(users).toHaveLength(4)
		expect(users[3].username).toBe('bob')
		expect(users[3].id).toBe('userId4')
		expect(users[3].color).toBe('bg-red-300')
		expect(users[3].selectorId).toBe('jamesId')
	})

	test('No more colors', () => {
		currentUserId.set('willId')
		selectedUsers.set(testSelectedUsers)

		addUser({
			selectorId: 'willId',
			id: 'userId4',
			username: 'bob'
		})

		let users = get(selectedUsers)
		expect(users).toHaveLength(4)
		expect(users[3].username).toBe('bob')
		expect(users[3].id).toBe('userId4')
		expect(users[3].color).toBe('bg-purple-300')
		expect(users[3].selectorId).toBe('willId')

		addUser({
			selectorId: 'willId',
			id: 'userId5',
			username: 'billy'
		})

		users = get(selectedUsers)
		expect(users).toHaveLength(5)
		expect(users[4].username).toBe('billy')
		expect(users[4].id).toBe('userId5')
		expect(users[4].color).toBe('bg-orange-300')
		expect(users[4].selectorId).toBe('willId')

		addUser({
			selectorId: 'willId',
			id: 'userId6',
			username: 'bobby'
		})

		users = get(selectedUsers)
		expect(users).toHaveLength(5)
	})
})

describe('removeUser', () => {
	test('Success', () => {
		currentUserId.set('willId')
		selectedUsers.set(testSelectedUsers)

		removeUser('userId2')

		const users = get(selectedUsers)
		expect(users).toHaveLength(2)
		expect(users[0].username).toBe('john')
		expect(users[0].id).toBe('userId1')
		expect(users[0].selectorId).toBe('willId')
		expect(users[0].color).toBe('bg-red-300')
		expect(users[1].username).toBe('sally')
		expect(users[1].id).toBe('userId3')
		expect(users[1].selectorId).toBe('willId')
		expect(users[1].color).toBe('bg-green-300')
	})

	test('No change', () => {
		currentUserId.set('willId')
		selectedUsers.set(testSelectedUsers)

		removeUser('userId4')

		const users = get(selectedUsers)
		expect(users).toEqual(testSelectedUsers)
	})

	test('Different current user, no change', () => {
		currentUserId.set('jamesId')
		selectedUsers.set(testSelectedUsers)

		removeUser('userId1')

		const users = get(selectedUsers)
		expect(users).toEqual(testSelectedUsers)
	})
})

describe('Add and remove user', () => {
	test('Same current user', () => {
		currentUserId.set('willId')
		selectedUsers.set(testSelectedUsers)

		addUser({
			selectorId: 'willId',
			id: 'userId4',
			username: 'bob'
		})

		removeUser('userId4')

		const users = get(selectedUsers)
		expect(users).toEqual(testSelectedUsers)
	})

	test('Different current user', () => {
		currentUserId.set('jamesId')
		selectedUsers.set(testSelectedUsers)

		addUser({
			selectorId: 'jamesId',
			id: 'userId4',
			username: 'bob'
		})

		removeUser('userId4')

		const users = get(selectedUsers)
		expect(users).toEqual(testSelectedUsers)
	})
})
