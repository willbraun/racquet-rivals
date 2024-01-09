<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte'
	import { getModalStore } from '@skeletonlabs/skeleton'
	export let parent: SvelteComponent

	const modalStore = getModalStore()

	let buttonRef: HTMLButtonElement
	onMount(() => {
		if (buttonRef) {
			buttonRef.blur()
		}
	})
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4 bg-white">
		<header class="text-2xl font-bold">{$modalStore[0].title ?? '(title missing)'}</header>
		<footer class="modal-footer {parent.regionFooter}">
			<button
				class="btn rounded-md variant-glass-primary"
				bind:this={buttonRef}
				on:click={parent.onClose}>Close</button
			>
		</footer>
	</div>
{/if}
