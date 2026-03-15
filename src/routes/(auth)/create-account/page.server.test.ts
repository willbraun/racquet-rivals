import { afterEach, describe, expect, test, vi } from 'vitest'
import { actions } from './+page.server'

type ActionEvent = Parameters<typeof actions.default>[0]

// Helpers

const makeFormData = (fields: Record<string, string>) => {
	const fd = new FormData()
	for (const [key, val] of Object.entries(fields)) fd.set(key, val)
	return fd
}

const validFields = {
	username: 'testuser',
	email: 'test@example.com',
	password: 'validpassword',
	cf_token: 'valid-token',
	nickname: '',
	loginGoto: '/dashboard'
}

const makePb = (collectionOverrides: Record<string, unknown> = {}) => ({
	collection: vi.fn().mockReturnValue({
		create: vi.fn().mockResolvedValue({}),
		authWithPassword: vi.fn().mockResolvedValue({}),
		...collectionOverrides
	})
})

const makeEvent = (fields: Record<string, string>, pb = makePb()) =>
	({
		request: { formData: () => Promise.resolve(makeFormData(fields)) },
		locals: { pb }
	}) as unknown as ActionEvent

const stubFetch = (success: boolean) =>
	vi.stubGlobal(
		'fetch',
		vi.fn().mockResolvedValue({
			json: () => Promise.resolve({ success })
		})
	)

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('Create account server action', () => {
	test('Returns 400 if honeypot is filled', async () => {
		const result = await actions.default(makeEvent({ ...validFields, nickname: 'bot' }))

		expect(result.status).toBe(400)
		expect(result.data.error).toBe('Something went wrong, please try again')
	})

	test('Returns 400 if required fields are missing', async () => {
		const result = await actions.default(makeEvent({ ...validFields, username: '' }))

		expect(result.status).toBe(400)
		expect(result.data.error).toBe('Please fill in all fields')
	})

	test('Returns 400 if Turnstile verification fails', async () => {
		stubFetch(false)

		const result = await actions.default(makeEvent(validFields))

		expect(result.status).toBe(400)
		expect(result.data.error).toBe('Cloudflare verification failed, please try again')
	})

	test('Returns 400 with error details if PocketBase user creation fails', async () => {
		stubFetch(true)

		const pbError = {
			status: 400,
			message: 'Failed to create record',
			data: { data: { username: { message: 'The value must be unique.' } } }
		}
		const pb = {
			collection: vi.fn().mockReturnValue({
				create: vi.fn().mockRejectedValue(pbError),
				authWithPassword: vi.fn()
			})
		}

		const result = await actions.default(makeEvent(validFields, pb))

		expect(result.status).toBe(400)
		expect(result.data.error).toContain('Error: 400')
		expect(result.data.error).toContain('Username: The value must be unique.')
	})

	test('Redirects to loginGoto on successful account creation', async () => {
		stubFetch(true)

		let thrown: unknown
		try {
			await actions.default(makeEvent(validFields))
		} catch (e) {
			thrown = e
		}

		const redirect = thrown as { status: number; location: string }
		expect(redirect.status).toBe(303)
		expect(redirect.location).toBe('/dashboard')
	})

	test('Redirects to / by default when loginGoto is not provided', async () => {
		stubFetch(true)

		const fieldsWithoutLoginGoto = { ...validFields, loginGoto: '' }

		let thrown: unknown
		try {
			await actions.default(makeEvent(fieldsWithoutLoginGoto))
		} catch (e) {
			thrown = e
		}

		const redirect = thrown as { status: number; location: string }
		expect(redirect.status).toBe(303)
		expect(redirect.location).toBe('/')
	})
})
