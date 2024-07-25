<script lang="ts">
	import {
		getModalStore,
		initializeStores,
		storePopup,
		type ModalSettings
	} from '@skeletonlabs/skeleton'
	import TestModal from './TestModal.svelte'
	import SelectUsers from '../../../routes/draw/[slug]/SelectUsers.svelte'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	initializeStores()
	const modalStore = getModalStore()
	const modal: ModalSettings = {
		type: 'component',
		component: 'selectUsers',
		title: 'Select Users',
		body: 'Compare predictions with your friends (max of 6 total)',
		backdropClasses: 'bg-surface-500',
		meta: {
			currentUserId: 'userId',
			currentUsername: 'will'
		}
	}

	modalStore.trigger(modal)
</script>

<SelectUsers parent={TestModal} />
