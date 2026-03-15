import { dev } from '$app/environment'
import { CF_TURNSTILE_SECRET_KEY } from '$env/static/private'
import type { BasePageData } from '$lib/types.js'
import { fail, redirect } from '@sveltejs/kit'

export async function load() {
	return {
		title: 'Create Account',
		description: 'Sign up for Racquet Rivals.'
	} as BasePageData
}

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const username = formData.get('username') as string
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const cfToken = formData.get('cf_token') as string
		const honeypot = formData.get('nickname') as string
		const loginGoto = (formData.get('loginGoto') as string) || '/'

		if (honeypot) {
			return fail(400, { error: 'Something went wrong, please try again' })
		}

		if (!username || !email || !password) {
			return fail(400, { error: 'Please fill in all fields' })
		}

		// Verify Cloudflare Turnstile token server-side
		const verifyResponse = await fetch(
			'https://challenges.cloudflare.com/turnstile/v0/siteverify',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					secret: dev ? '1x0000000000000000000000000000000AA' : CF_TURNSTILE_SECRET_KEY,
					response: cfToken
				})
			}
		)
		const verifyData = await verifyResponse.json()
		if (!verifyData.success) {
			return fail(400, { error: 'Cloudflare verification failed, please try again' })
		}

		// Create user in PocketBase (collection allows unauthenticated creation)
		try {
			await locals.pb.collection('user').create({
				username,
				email,
				emailVisibility: true,
				password,
				passwordConfirm: password,
				role: 'user'
			})
			await locals.pb.collection('user').authWithPassword(email, password)
		} catch (err: unknown) {
			const pbError = err as {
				status?: number
				message?: string
				data?: { data?: Record<string, { message: string }> }
			}
			const data = pbError?.data?.data
			let message = `Error: ${pbError?.status ?? ''} - ${pbError?.message ?? 'Unknown error'}`
			if (data && Object.keys(data).length > 0) {
				const details = Object.entries(data)
					.map(
						([key, val]) => `• ${key[0].toUpperCase() + key.slice(1).toLowerCase()}: ${val.message}`
					)
					.join('\n')
				message += `\n${details}`
			}
			return fail(400, { error: message })
		}

		// Hook will write the auth cookie from locals.pb.authStore automatically
		redirect(303, loginGoto)
	}
}
