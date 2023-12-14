import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin'

export const myCustomTheme: CustomThemeConfig = {
	name: 'my-custom-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-family-heading': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '6px',
		'--theme-rounded-container': '6px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '0 0 0',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #22814D
		'--color-primary-50': '222 236 228', // #deece4
		'--color-primary-100': '211 230 219', // #d3e6db
		'--color-primary-200': '200 224 211', // #c8e0d3
		'--color-primary-300': '167 205 184', // #a7cdb8
		'--color-primary-400': '100 167 130', // #64a782
		'--color-primary-500': '34 129 77', // #22814D
		'--color-primary-600': '31 116 69', // #1f7445
		'--color-primary-700': '26 97 58', // #1a613a
		'--color-primary-800': '20 77 46', // #144d2e
		'--color-primary-900': '17 63 38', // #113f26
		// secondary | #DDDDE3
		'--color-secondary-50': '250 250 251', // #fafafb
		'--color-secondary-100': '248 248 249', // #f8f8f9
		'--color-secondary-200': '247 247 248', // #f7f7f8
		'--color-secondary-300': '241 241 244', // #f1f1f4
		'--color-secondary-400': '231 231 235', // #e7e7eb
		'--color-secondary-500': '221 221 227', // #DDDDE3
		'--color-secondary-600': '199 199 204', // #c7c7cc
		'--color-secondary-700': '166 166 170', // #a6a6aa
		'--color-secondary-800': '133 133 136', // #858588
		'--color-secondary-900': '108 108 111', // #6c6c6f
		// tertiary | #D770FF
		'--color-tertiary-50': '249 234 255', // #f9eaff
		'--color-tertiary-100': '247 226 255', // #f7e2ff
		'--color-tertiary-200': '245 219 255', // #f5dbff
		'--color-tertiary-300': '239 198 255', // #efc6ff
		'--color-tertiary-400': '227 155 255', // #e39bff
		'--color-tertiary-500': '215 112 255', // #D770FF
		'--color-tertiary-600': '194 101 230', // #c265e6
		'--color-tertiary-700': '161 84 191', // #a154bf
		'--color-tertiary-800': '129 67 153', // #814399
		'--color-tertiary-900': '105 55 125', // #69377d
		// success | #4ad317
		'--color-success-50': '228 248 220', // #e4f8dc
		'--color-success-100': '219 246 209', // #dbf6d1
		'--color-success-200': '210 244 197', // #d2f4c5
		'--color-success-300': '183 237 162', // #b7eda2
		'--color-success-400': '128 224 93', // #80e05d
		'--color-success-500': '74 211 23', // #4ad317
		'--color-success-600': '67 190 21', // #43be15
		'--color-success-700': '56 158 17', // #389e11
		'--color-success-800': '44 127 14', // #2c7f0e
		'--color-success-900': '36 103 11', // #24670b
		// warning | #EAB308
		'--color-warning-50': '252 244 218', // #fcf4da
		'--color-warning-100': '251 240 206', // #fbf0ce
		'--color-warning-200': '250 236 193', // #faecc1
		'--color-warning-300': '247 225 156', // #f7e19c
		'--color-warning-400': '240 202 82', // #f0ca52
		'--color-warning-500': '234 179 8', // #EAB308
		'--color-warning-600': '211 161 7', // #d3a107
		'--color-warning-700': '176 134 6', // #b08606
		'--color-warning-800': '140 107 5', // #8c6b05
		'--color-warning-900': '115 88 4', // #735804
		// error | #DE2B34
		'--color-error-50': '250 223 225', // #fadfe1
		'--color-error-100': '248 213 214', // #f8d5d6
		'--color-error-200': '247 202 204', // #f7cacc
		'--color-error-300': '242 170 174', // #f2aaae
		'--color-error-400': '232 107 113', // #e86b71
		'--color-error-500': '222 43 52', // #DE2B34
		'--color-error-600': '200 39 47', // #c8272f
		'--color-error-700': '167 32 39', // #a72027
		'--color-error-800': '133 26 31', // #851a1f
		'--color-error-900': '109 21 25', // #6d1519
		// surface | #495a8f
		'--color-surface-50': '228 230 238', // #e4e6ee
		'--color-surface-100': '219 222 233', // #dbdee9
		'--color-surface-200': '210 214 227', // #d2d6e3
		'--color-surface-300': '182 189 210', // #b6bdd2
		'--color-surface-400': '128 140 177', // #808cb1
		'--color-surface-500': '73 90 143', // #495a8f
		'--color-surface-600': '66 81 129', // #425181
		'--color-surface-700': '55 68 107', // #37446b
		'--color-surface-800': '44 54 86', // #2c3656
		'--color-surface-900': '36 44 70' // #242c46
	}
}
