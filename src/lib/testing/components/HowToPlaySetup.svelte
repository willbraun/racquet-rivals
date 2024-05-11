<script lang="ts">
	import {
		getModalStore,
		initializeStores,
		storePopup,
		type ModalSettings
	} from '@skeletonlabs/skeleton'
	import TestModal from './TestModal.svelte'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	import HowToPlayContent from '$lib/HowToPlayContent.svelte'

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	initializeStores()
	const modalStore = getModalStore()
	const modal: ModalSettings = {
		type: 'component',
		component: 'howToPlayContent',
		title: 'How to Play',
		backdropClasses: 'bg-surface-500'
	}

	modalStore.trigger(modal)
</script>

<HowToPlayContent parent={TestModal} />
