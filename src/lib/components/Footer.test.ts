import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import Footer from './Footer.svelte'
import PageSetup from './PageSetup.test.svelte'

describe('Footer component', () => {
	test('Renders footer element', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		expect(screen.getByTestId('Footer')).toBeInTheDocument()
	})

	test('Contains About Racquet Rivals link', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		const aboutLink = screen.getByRole('link', { name: /about racquet rivals/i })
		expect(aboutLink).toBeInTheDocument()
		expect(aboutLink).toHaveAttribute('href', '/about')
	})

	test('Contains Instagram link with correct attributes', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		const instagramLink = screen.getByRole('link', { name: /follow us on instagram/i })
		expect(instagramLink).toBeInTheDocument()
		expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/racquetrivals/')
		expect(instagramLink).toHaveAttribute('target', '_blank')
	})

	test('Contains Instagram icon image', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		const instagramImage = screen.getByAltText('instagram')
		expect(instagramImage).toBeInTheDocument()
	})

	test('Contains Send Feedback link with correct attributes', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		const feedbackLink = screen.getByRole('link', { name: /send feedback/i })
		expect(feedbackLink).toBeInTheDocument()
		expect(feedbackLink).toHaveAttribute(
			'href',
			'https://docs.google.com/forms/d/e/1FAIpQLSe7fc5Z2MNam-AHp-GOXya2cwcdnjVPHRo2lcUy4_YBNwFL9A/viewform'
		)
		expect(feedbackLink).toHaveAttribute('target', '_blank')
	})

	test('Contains Buy Me A Coffee link and image', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		const coffeeLink = screen.getByRole('link', { name: /buy me a coffee/i })
		expect(coffeeLink).toBeInTheDocument()
		expect(coffeeLink).toHaveAttribute('href', 'https://www.buymeacoffee.com/willbraun')
		expect(coffeeLink).toHaveAttribute('target', '_blank')

		const coffeeImage = screen.getByAltText('Buy Me A Coffee')
		expect(coffeeImage).toBeInTheDocument()
	})

	test('Contains disclaimer text', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		expect(
			screen.getByText(
				/this site is not affiliated with the atp, wta, ncaa, any tournament or player/i
			)
		).toBeInTheDocument()
	})

	test('Contains author name', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		expect(screen.getByText('Will Braun')).toBeInTheDocument()
	})

	test('Contains LinkedIn link with correct attributes', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		const linkedInLinks = screen.getAllByRole('link')
		const linkedInLink = linkedInLinks.find(
			(link) => link.getAttribute('href') === 'https://www.linkedin.com/in/williamhbraun/'
		)

		expect(linkedInLink).toBeDefined()
		expect(linkedInLink).toHaveAttribute('target', '_blank')
		expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer')
	})

	test('Contains GitHub link with correct attributes', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		const githubLinks = screen.getAllByRole('link')
		const githubLink = githubLinks.find(
			(link) => link.getAttribute('href') === 'https://github.com/willbraun'
		)

		expect(githubLink).toBeDefined()
		expect(githubLink).toHaveAttribute('target', '_blank')
		expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
	})

	test('All external links open in new tab', () => {
		render(PageSetup, {
			props: {
				component: Footer
			}
		})

		const allLinks = screen.getAllByRole('link')
		const externalLinks = allLinks.filter((link) => link.getAttribute('href')?.startsWith('http'))

		externalLinks.forEach((link) => {
			expect(link).toHaveAttribute('target', '_blank')
		})
	})
})
