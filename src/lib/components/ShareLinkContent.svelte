<script lang="ts">
	import check from '$lib/images/icons/check-solid.svg'
	import clone from '$lib/images/icons/clone-regular.svg'
	import sms from '$lib/images/icons/comment-sms-solid.svg'
	import x from '$lib/images/icons/x.svg'
	import { currentUser, shareLinkOpen } from '$lib/store'
	import { onMount } from 'svelte'

	const message = $currentUser
		? `Join me (${$currentUser?.username}) on Racquet Rivals! Click here to play - https://racquetrivals.com`
		: 'Check out Racquet Rivals! Click here to play - https://racquetrivals.com'
	const encoded = encodeURIComponent(message)

	let showCheck = $state(false)
	let copyEmail: (() => void) | null = $state(null)
	onMount(() => {
		copyEmail = (): void => {
			navigator.clipboard.writeText('https://racquetrivals.com')
			showCheck = true
		}
	})
</script>

<div class="flex h-full w-full flex-col items-center gap-8 bg-green-100">
	<div class="relative w-full bg-green-300 p-2 text-center">
		<p class="text-3xl font-bold">Share</p>
		<button
			onclick={() => shareLinkOpen.set(false)}
			class="absolute top-0 top-1/2 right-4 -translate-y-1/2"
		>
			<img src={x} alt="close" width="24" />
		</button>
	</div>
	<a href={`sms:?body=${encoded}`} class="flex items-center gap-4">
		<img src={sms} alt="sms text message" width="42" />
		<p class="text-xl">Text Message</p>
	</a>
	<button class="relative flex items-center gap-4" onclick={() => copyEmail?.()}>
		<img src={clone} alt="copy to clipboard" width="42" />
		<p class="w-32 text-xl">{showCheck ? 'Copied!' : 'Copy Link'}</p>
		<div class="absolute -right-10 {showCheck ? 'block' : 'hidden'}">
			<img src={check} alt="copied check mark" width="42" />
		</div>
	</button>
</div>
