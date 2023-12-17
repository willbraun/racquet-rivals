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
		'--on-secondary': '255 255 255',
		'--on-tertiary': '255 255 255',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '0 0 0',
		'--on-surface': '0 0 0',
		// =~= Theme Colors  =~=
		// primary | #313DC4
		'--color-primary-50': '224 226 246', // #e0e2f6
		'--color-primary-100': '214 216 243', // #d6d8f3
		'--color-primary-200': '204 207 240', // #cccff0
		'--color-primary-300': '173 177 231', // #adb1e7
		'--color-primary-400': '111 119 214', // #6f77d6
		'--color-primary-500': '49 61 196', // #313DC4
		'--color-primary-600': '44 55 176', // #2c37b0
		'--color-primary-700': '37 46 147', // #252e93
		'--color-primary-800': '29 37 118', // #1d2576
		'--color-primary-900': '24 30 96', // #181e60
		// secondary | #8e017b
		'--color-secondary-50': '238 217 235', // #eed9eb
		'--color-secondary-100': '232 204 229', // #e8cce5
		'--color-secondary-200': '227 192 222', // #e3c0de
		'--color-secondary-300': '210 153 202', // #d299ca
		'--color-secondary-400': '176 77 163', // #b04da3
		'--color-secondary-500': '142 1 123', // #8e017b
		'--color-secondary-600': '128 1 111', // #80016f
		'--color-secondary-700': '107 1 92', // #6b015c
		'--color-secondary-800': '85 1 74', // #55014a
		'--color-secondary-900': '70 0 60', // #46003c
		// tertiary | #27871D
		'--color-tertiary-50': '223 237 221', // #dfeddd
		'--color-tertiary-100': '212 231 210', // #d4e7d2
		'--color-tertiary-200': '201 225 199', // #c9e1c7
		'--color-tertiary-300': '169 207 165', // #a9cfa5
		'--color-tertiary-400': '104 171 97', // #68ab61
		'--color-tertiary-500': '39 135 29', // #27871D
		'--color-tertiary-600': '35 122 26', // #237a1a
		'--color-tertiary-700': '29 101 22', // #1d6516
		'--color-tertiary-800': '23 81 17', // #175111
		'--color-tertiary-900': '19 66 14', // #13420e
		// success | #4ad353
		'--color-success-50': '228 248 229', // #e4f8e5
		'--color-success-100': '219 246 221', // #dbf6dd
		'--color-success-200': '210 244 212', // #d2f4d4
		'--color-success-300': '183 237 186', // #b7edba
		'--color-success-400': '128 224 135', // #80e087
		'--color-success-500': '74 211 83', // #4ad353
		'--color-success-600': '67 190 75', // #43be4b
		'--color-success-700': '56 158 62', // #389e3e
		'--color-success-800': '44 127 50', // #2c7f32
		'--color-success-900': '36 103 41', // #246729
		// warning | #fff947
		'--color-warning-50': '255 254 227', // #fffee3
		'--color-warning-100': '255 254 218', // #fffeda
		'--color-warning-200': '255 254 209', // #fffed1
		'--color-warning-300': '255 253 181', // #fffdb5
		'--color-warning-400': '255 251 126', // #fffb7e
		'--color-warning-500': '255 249 71', // #fff947
		'--color-warning-600': '230 224 64', // #e6e040
		'--color-warning-700': '191 187 53', // #bfbb35
		'--color-warning-800': '153 149 43', // #99952b
		'--color-warning-900': '125 122 35', // #7d7a23
		// error | #e18e9f
		'--color-error-50': '251 238 241', // #fbeef1
		'--color-error-100': '249 232 236', // #f9e8ec
		'--color-error-200': '248 227 231', // #f8e3e7
		'--color-error-300': '243 210 217', // #f3d2d9
		'--color-error-400': '234 176 188', // #eab0bc
		'--color-error-500': '225 142 159', // #e18e9f
		'--color-error-600': '203 128 143', // #cb808f
		'--color-error-700': '169 107 119', // #a96b77
		'--color-error-800': '135 85 95', // #87555f
		'--color-error-900': '110 70 78', // #6e464e
		// surface | #DDDDE3
		'--color-surface-50': '250 250 251', // #fafafb
		'--color-surface-100': '248 248 249', // #f8f8f9
		'--color-surface-200': '247 247 248', // #f7f7f8
		'--color-surface-300': '241 241 244', // #f1f1f4
		'--color-surface-400': '231 231 235', // #e7e7eb
		'--color-surface-500': '221 221 227', // #DDDDE3
		'--color-surface-600': '199 199 204', // #c7c7cc
		'--color-surface-700': '166 166 170', // #a6a6aa
		'--color-surface-800': '133 133 136', // #858588
		'--color-surface-900': '108 108 111' // #6c6c6f
	}
}
