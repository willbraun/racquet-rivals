import { fail } from '@sveltejs/kit'
import { errorMessage } from '$lib/utils'
import type { ClientResponseError } from 'pocketbase'
// import type { SelectedUser } from '$lib/types.js'

export const actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData()
		const username = (form.get('username') ?? '') as string
		const email = (form.get('email') ?? '') as string
		const password = (form.get('password') ?? '') as string
		let clientError = ''

		if (username === '') {
			clientError = 'Please enter your username\n'
		}

		if (email === '') {
			clientError += 'Please enter your email\n'
		}

		if (password === '') {
			clientError += 'Please enter your password'
		}

		if (clientError) {
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
			// const authResponse =
			await locals.pb.collection('user').authWithPassword(email, password)
			// cookies.set(
			// 	'currentUser',
			// 	JSON.stringify({
			// 		selectorId: authResponse.record.id,
			// 		id: authResponse.record.id,
			// 		username: authResponse.record.username,
			// 		color: mainColor
			// 	} as SelectedUser),
			// 	{ maxAge: 60 * 60 * 24 * 7, path: '/' }
			// )
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
