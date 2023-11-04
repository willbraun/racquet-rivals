import { fail } from '@sveltejs/kit'
import { errorMessage } from '$lib/utils'
import Pocketbase, { ClientResponseError } from 'pocketbase'

const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData()
		const usernameOrEmail = (form.get('usernameOrEmail') ?? '') as string
		const password = (form.get('password') ?? '') as string
		let clientError = ''

		if (usernameOrEmail === '') {
			clientError = 'Please enter your username or email\n'
		}

		if (password === '') {
			clientError += 'Please enter your password'
		}

		if (clientError) {
			return fail(400, {
				error: clientError
			})
		}

		try {
			const data = await pb.collection('user').authWithPassword(usernameOrEmail, password)
			cookies.set(
				'auth',
				JSON.stringify({
					token: data.token,
					userId: data.record.id,
					username: data.record.username
				}),
				{
					maxAge: 60 * 60 * 24 * 7
				}
			)
			return {
				error: ''
			}
		} catch (e) {
			const statusCode = (e as ClientResponseError).status
			return fail(statusCode, {
				error: errorMessage(e)
			})
		}
	},

	logout: async ({ cookies }) => {
		try {
			pb.authStore.clear()
			cookies.delete('auth')
		} catch (e) {
			errorMessage(e)
		}
	}
}
