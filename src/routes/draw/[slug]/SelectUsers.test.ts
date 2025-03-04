import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
import SelectUsersTest from './SelectUsers.test.svelte'
import { currentUser } from '$lib/store'

describe('SelectUsers component', () => {
	test('Renders', () => {
		currentUser.set({
			collectionId: '_pb_users_auth_',
			collectionName: 'user',
			avatar: '',
			id: 'willId',
			username: 'will',
			emailVisibility: true,
			created: '2024-05-02 15:42:20.397Z',
			updated: '2024-05-02 15:42:20.397Z'
		})

		render(SelectUsersTest)

		expect(screen.getByText('Select Users')).toBeInTheDocument()
		expect(screen.getByText('will')).toBeInTheDocument()
	})
})
