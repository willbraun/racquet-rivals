import { currentUser, selectedUsers } from '$lib/store'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import SelectUsersTest from './SelectUsers.test.svelte'

describe('SelectUsers component', () => {
	test('Renders with selections', () => {
		currentUser.set({
			collectionId: '_pb_users_auth_',
			collectionName: 'user',
			avatar: '',
			id: 'willId',
			username: 'will',
			emailVisibility: true,
			created: '2024-05-02 15:42:20.397Z',
			updated: '2024-05-02 15:42:20.397Z',
			grandfathered: false,
			paddle_customer_id: 'ctm_12345'
		})

		selectedUsers.set([
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
			}
		])

		render(SelectUsersTest)

		expect(screen.getByText('Select Users')).toBeInTheDocument()
		expect(screen.getByText('will')).toBeInTheDocument()
		expect(screen.getByText('john')).toBeInTheDocument()
		expect(screen.getByText('steve')).toBeInTheDocument()
	})
})
