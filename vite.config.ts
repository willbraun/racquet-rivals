import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { mainColor, selectColors } from './src/lib/utils'

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss({
			safelist: {
				standard: [mainColor, ...selectColors]
			}
		})
	]
})
