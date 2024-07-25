import { fail, type Actions } from '@sveltejs/kit'
import { errorMessage } from '$lib/utils'
import type { ClientResponseError } from 'pocketbase'
// import type { SelectedUser } from '$lib/types'

export const actions: Actions = {
	default: async ({ request, locals }) => {
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
			// const authResponse =
			await locals.pb.collection('user').authWithPassword(usernameOrEmail, password)
			// cookies.set(
			// 	'currentUser',
			// 	JSON.stringify({
			// 		selectorId: authResponse.record.id,
			// 		id: authResponse.record.id,
			// 		username: authResponse.record.username,
			// 		color: mainColor
			// 	} as SelectedUser),
			// 	{ maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: false, secure: false }
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
