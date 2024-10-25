import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import { skeleton } from '@skeletonlabs/tw-plugin'
import { myCustomTheme } from './src/myCustomTheme.ts'
import { mainColor, selectColors } from './src/lib/data'

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	safelist: [mainColor, ...selectColors],
	theme: {
		extend: {
			colors: {
				'pure-red': '#ff0000',
				'stone-250': '#dedcda'
			},
			borderWidth: {
				'1': '1px',
				'16': '16px'
			},
			gridTemplateColumns: {
				'5': 'repeat(5, 1fr)'
			},
			keyframes: {
				'pulse-green': {
					'0%, 100%': {},
					'50%': { backgroundColor: '#a7f3d0' }
				}
			},
			animation: {
				'pulse-green': 'pulse-green 3s infinite'
			}
		}
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [myCustomTheme]
			}
		})
	]
} satisfies Config
