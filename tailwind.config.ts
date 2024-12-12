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
	future: {
		hoverOnlyWhenSupported: true
	},
	theme: {
		extend: {
			fontFamily: {
				PoetsenOne: ['PoetsenOne-Regular, sans-serif']
			},
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
				'fade-and-slide-in': {
					'0%': { opacity: '0', transform: 'translateX(-1rem)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'pulse-green': {
					'0%, 100%': {},
					'50%': { backgroundColor: '#a7f3d0' }
				}
			},
			animation: {
				'fade-and-slide-in': 'fade-and-slide-in 400ms ease-out',
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
