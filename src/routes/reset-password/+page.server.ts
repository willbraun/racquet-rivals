import { fail } from '@sveltejs/kit'
import { errorMessage } from '$lib/utils'
import Pocketbase, { ClientResponseError } from 'pocketbase'

const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

export const actions = {
	resetPassword: async ({ request }) => {
		const form = await request.formData()
		const email = (form.get('email') ?? '') as string

		if (email === '') {
			return fail(400, {
				error: 'Please enter your email'
			})
		}

		try {
			await pb.collection('user').requestPasswordReset(email)
			return {
				success: true,
				error: ''
			}
		} catch (e) {
			const statusCode = (e as ClientResponseError).status
			return fail(statusCode, {
				success: false,
				error: errorMessage(e)
			})
		}
	}
}
