<script lang="ts">
	import { isAuth } from './store'
	import share from '$lib/images/icons/share-from-square-solid.svg'
	export let currentUser = ''

	const message = $isAuth
		? `Join me (${currentUser}) on Racquet Rivals! Click here to play - https://racquetrivals.com`
		: 'Check out Racquet Rivals! Click here to play - https://racquetrivals.com'

	const encoded = encodeURIComponent(message)
</script>

<a href={`sms:?body=${encoded}`}>
	<img src={share} alt="share via text" width="24" class="mr-auto" />
</a>
