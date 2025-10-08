<script lang="ts">
	import share from '$lib/images/icons/share-from-square-solid.svg'
	import { isMobile, navMenuOpen, shareLinkOpen } from '$lib/store'
</script>

{#if $isMobile}
	<button
		onclick={() => {
			navMenuOpen.set(false)
			setTimeout(() => shareLinkOpen.set(true), 250)
		}}
		class="grid w-full grid-cols-4 items-center gap-4"
		data-testid="share-link-icon"
	>
		<img src={share} alt="share" width="24" class="justify-self-center" />
		<p class="col-span-3 justify-self-start text-xl">Share</p>
	</button>
{/if}
