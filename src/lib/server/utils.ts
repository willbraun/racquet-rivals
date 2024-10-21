export const fetchJson = async (url: string, token: string, svelteFetch: SvelteFetch) => {
	const options = {
		headers: {
			Authorization: token
		}
	}

	const response = await svelteFetch(url, options)
	if (!response.ok) {
		throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`)
	}

	const data = await response.json()
	if (data.code && data.code !== 200) {
		throw new Error(`Error: ${data.status} - ${data.message}`)
	}

	return data
}
