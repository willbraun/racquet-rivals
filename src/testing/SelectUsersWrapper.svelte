<!-- used for testing SelectUsers only -->
<script lang="ts">
	import { getModalStore, initializeStores, type ModalSettings } from '@skeletonlabs/skeleton'
	import SelectUsers from '../routes/draw/[slug]/SelectUsers.svelte'
	import TestModal from './TestModal.svelte'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	import { storePopup } from '@skeletonlabs/skeleton'
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
			currentUsername: 'will',
			selectedUsers: [
				{
					id: 'userId2',
					username: 'john',
					color: 'bg-red-300'
				},
				{
					id: 'userId3',
					username: 'sally',
					color: 'bg-yellow-300'
				}
			]
		}
	}

	modalStore.trigger(modal)
</script>

<SelectUsers parent={TestModal} />
