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
	class="rounded-full w-6 h-6 p-2 mr-0 sm:mr-2 border border-black border-2 flex justify-center items-center font-extrabold"
	on:click={() => modalStore.trigger(modal)}>i</button
>
