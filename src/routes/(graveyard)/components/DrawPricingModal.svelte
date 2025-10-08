<script lang="ts">
		import { fade, fly } from 'svelte/transition'
	import DrawPricingContent from './DrawPricingContent.svelte'

	let { parent } = $props()

	const modalStore = getModalStore()
</script>

{#if $modalStore[0]}
	<div
		class="modal-example-form card border-surface-300-700 w-modal space-y-6 rounded-xl border p-6 shadow-xl"
		in:fly={{ y: 20, duration: 300 }}
		out:fade
	>
		<DrawPricingContent
			draw={$modalStore[0].meta.draw}
			mensDraw={$modalStore[0].meta?.mensDraw}
			womensDraw={$modalStore[0].meta?.womensDraw}
			onClose={parent.onClose}
		/>
	</div>
{/if}
