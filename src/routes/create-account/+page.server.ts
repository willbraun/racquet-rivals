import { fail } from '@sveltejs/kit'
import { errorMessage, mainColor } from '$lib/utils'
import Pocketbase, { ClientResponseError } from 'pocketbase'

const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

export const actions = {
	register: async ({ request, cookies }) => {
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
			await pb.collection('user').create(data)
			const authRes = await pb.collection('user').authWithPassword(email, password)
			cookies.set(
				'auth',
				JSON.stringify({
					token: authRes.token,
					user: {
						id: authRes.record.id,
						username: authRes.record.username,
						color: mainColor
					}
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
	}
}
