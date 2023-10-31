import { goto } from '$app/navigation'
// import { errorMessage } from '$lib/utils'
import { fail, redirect } from '@sveltejs/kit'
import Pocketbase from 'pocketbase'

const pb = new Pocketbase('https://tennisbracket.willbraun.dev')

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData()
		const usernameOrEmail = (form.get('usernameOrEmail') ?? '') as string
		const password = (form.get('password') ?? '') as string

		if (usernameOrEmail === '' || password === '') {
			throw redirect(307, '/login')
		}

		try {
			const data = await pb.collection('user').authWithPassword(usernameOrEmail, password)
			console.log(data)
			// set cookie
			goto('/')
			return data
		} catch (e) {
			return fail(400, {
				error: 'failed'
				// error: errorMessage(e)
			})
		}
	}
}
