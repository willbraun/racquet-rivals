import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit(), purgeCss(), svelteTesting()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js']
	},
	server: {
		host: '0.0.0.0'
	}
})
