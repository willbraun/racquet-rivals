// Use this script to create an empty draw of draw_slots in pocketbase. This may be necessary if the ATP or WTA site is not able to be scraped.
// Create the draw in pocketbase first, then run this script with the draw ID.

// To run
// npx ts-node create_empty_draw.ts <drawId>

import 'dotenv/config'
import Pocketbase from 'pocketbase'

// Set environment in .env
const url =
	process.env.CREATE_EMPTY_DRAW_ENV === 'production'
		? process.env.PROD_PB_URL
		: process.env.LOCAL_PB_URL

const pb = new Pocketbase(url)

if (!process.env.SUPER_USER || !process.env.SUPER_USER_PASSWORD) {
	throw new Error('Missing SUPER_USER or SUPER_USER_PASSWORD environment variables')
}

// Authenticate first
try {
	await pb
		.collection('_superusers')
		.authWithPassword(process.env.SUPER_USER, process.env.SUPER_USER_PASSWORD)
} catch (error) {
	console.error('Authentication failed:', error)
	process.exit(1)
}

// Create draw_slots
const drawId = process.argv[2]
const startRound = 1
const numRounds = 8
for (let i = 0; i < numRounds; i++) {
	const numPositions = 2 ** (numRounds - 1 - i)
	for (let j = 0; j < numPositions; j++) {
		const round = startRound + i
		const position = j + 1
		await pb.collection('draw_slot').create({
			draw_id: drawId,
			round,
			position,
			name: '',
			seed: '',
			created: new Date().toISOString(),
			updated: new Date().toISOString()
		})
		console.log(`Created draw_slot for draw ${drawId}, round ${round}, position ${position}`)
	}
}

pb.authStore.clear()
