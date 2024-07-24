import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
	plugins: [sveltekit(), purgeCss(), svelteTesting()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js']
	},
	server: {
		host: '0.0.0.0'
	}
})
