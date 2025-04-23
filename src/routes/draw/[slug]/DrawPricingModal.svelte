<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton'
	import { fade, fly } from 'svelte/transition'
	import DrawPricingContent from './DrawPricingContent.svelte'

	let { parent } = $props()

	const modalStore = getModalStore()

	// Base Classes
	const cBase =
		'card p-6 w-modal shadow-xl space-y-6 rounded-xl border border-surface-300-600-token'
	const cHeader =
		'text-2xl font-bold bg-gradient-to-l from-primary-300 to-primary-500 text-white p-4 rounded-lg'
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}" in:fly={{ y: 20, duration: 300 }} out:fade>
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>
			<DrawPricingContent draw={$modalStore[0].meta.draw} onClose={parent.onClose} />
		</article>
		<footer class="modal-footer flex justify-end gap-2">
			<button
				class="variant-soft btn transition-all duration-200 hover:variant-soft-primary"
				onclick={parent.onClose}
			>
				Close
			</button>
		</footer>
	</div>
{/if}
