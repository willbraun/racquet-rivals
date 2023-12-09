import { fail } from '@sveltejs/kit'
import { errorMessage, mainColor } from '$lib/utils'
import type { ClientResponseError } from 'pocketbase'

export const actions = {
	default: async ({ request, cookies, locals }) => {
		const form = await request.formData()
		const username = (form.get('username') ?? '') as string
		const email = (form.get('email') ?? '') as string
		const password = (form.get('password') ?? '') as string
		let clientError = ''
		let isClientError = false

		if (username === '') {
			clientError = 'Please enter your username\n'
			isClientError = true
		}

		if (email === '') {
			clientError += 'Please enter your email\n'
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

		const data = {
			username,
			email,
			emailVisibility: true,
			password,
			passwordConfirm: password
		}

		try {
			await locals.pb.collection('user').create(data)
			const authResponse = await locals.pb.collection('user').authWithPassword(email, password)
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
