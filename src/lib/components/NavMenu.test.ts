import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import { currentUser } from '../store'
import NavMenu from './NavMenu.svelte'
import PageSetup from './PageSetup.test.svelte'

describe('NavMenu component', () => {
	test('Renders', () => {
		render(PageSetup, { component: NavMenu })

		expect(screen.getByTestId('hamburger-icon')).toBeInTheDocument()
	})

	test('Shows admin nav link for admin', () => {
		currentUser.set({
			collectionId: '_pb_users_auth_',
			collectionName: 'user',
			avatar: '',
			id: 'adminId',
			username: 'admin',
			role: 'admin',
			emailVisibility: true,
			created: '2024-05-02 15:42:20.397Z',
			updated: '2024-05-02 15:42:20.397Z'
		})
		render(PageSetup, { component: NavMenu })

		expect(screen.getByTestId('hamburger-icon')).toBeInTheDocument()
		expect(screen.getByTestId('admin-nav-link')).toBeInTheDocument()
	})

	test('Does not show admin nav link for non-admin', () => {
		currentUser.set({
			collectionId: '_pb_users_auth_',
			collectionName: 'user',
			avatar: '',
			id: 'userId',
			username: 'user',
			role: 'user',
			emailVisibility: true,
			created: '2024-05-02 15:42:20.397Z',
			updated: '2024-05-02 15:42:20.397Z'
		})
		render(PageSetup, { component: NavMenu })

		expect(screen.getByTestId('hamburger-icon')).toBeInTheDocument()
		expect(screen.queryByTestId('admin-nav-link')).not.toBeInTheDocument()
	})
})
