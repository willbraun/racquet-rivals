import { fail, type Actions } from '@sveltejs/kit'
import { errorMessage, mainColor } from '$lib/utils'
import type { ClientResponseError } from 'pocketbase'

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		const form = await request.formData()
		const usernameOrEmail = (form.get('usernameOrEmail') ?? '') as string
		const password = (form.get('password') ?? '') as string
		let clientError = ''
		let isClientError = false

		if (usernameOrEmail === '') {
			clientError = 'Please enter your username or email\n'
			isClientError = true
		}

		if (password === '') {
			clientError += 'Please enter your password'
			isClientError = true
		}

		if (isClientError) {
			return fail(400, {
				error: clientError
			})
		}

		try {
			const authResponse = await locals.pb
				.collection('user')
				.authWithPassword(usernameOrEmail, password)
			cookies.set(
				'currentUser',
				JSON.stringify({
					id: authResponse.record.id,
					username: authResponse.record.username,
					color: mainColor
				}),
				{ maxAge: 60 * 60 * 24 * 7 }
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
	}
}
