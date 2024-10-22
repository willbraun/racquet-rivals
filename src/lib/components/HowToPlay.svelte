<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'

	export let showName = false

	const modalStore = getModalStore()
	const modal: ModalSettings = {
		type: 'component',
		component: 'howToPlayContent',
		title: 'How to Play',
		backdropClasses: 'bg-surface-500'
	}
</script>

<button
	class={`${showName && 'grid grid-cols-4 items-center gap-4'}`}
	on:click={() => modalStore.trigger(modal)}
>
	<p
		class="flex h-6 w-6 items-center justify-center rounded-full border border-2 border-black p-2 font-extrabold"
	>
		i
	</p>
	{#if showName}
		<p class="col-span-3 text-xl">How to Play</p>
	{/if}
</button>
