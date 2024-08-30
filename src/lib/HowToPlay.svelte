<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'

	const modalStore = getModalStore()
	const modal: ModalSettings = {
		type: 'component',
		component: 'howToPlayContent',
		title: 'How to Play',
		backdropClasses: 'bg-surface-500'
	}
</script>

<button
	class="mr-0 flex h-6 w-6 items-center justify-center rounded-full border border-2 border-black p-2 font-extrabold sm:mr-2"
	on:click={() => modalStore.trigger(modal)}>i</button
>
