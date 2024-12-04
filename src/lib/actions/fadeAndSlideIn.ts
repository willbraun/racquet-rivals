export const fadeAndSlideIn = (node: HTMLElement) => {
	node.classList.add('opacity-0')

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.remove('opacity-0')
				node.classList.add('animate-fade-and-slide-in')
				observer.unobserve(node)
			}
		},
		{
			threshold: 0.1
		}
	)

	observer.observe(node)

	return {
		destroy() {
			observer.unobserve(node)
			observer.disconnect()
		}
	}
}
