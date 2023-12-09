import { fail } from '@sveltejs/kit'
import { errorMessage } from '$lib/utils'
import type { ClientResponseError } from 'pocketbase'

export const actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData()
		const email = (form.get('email') ?? '') as string

		if (email === '') {
			return fail(400, {
				error: 'Please enter your email'
			})
		}

		try {
			await locals.pb.collection('user').requestPasswordReset(email)
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
