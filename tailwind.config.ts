import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import { skeleton } from '@skeletonlabs/tw-plugin'
import { myCustomTheme } from './src/myCustomTheme.ts'
import { mainColor, selectColors } from './src/lib/utils'

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	safelist: [mainColor, ...selectColors],
	theme: {
		extend: {
			borderWidth: {
				'1': '1px',
				'16': '16px'
			},
			gridTemplateColumns: {
				'5': 'repeat(5, 1fr)'
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
