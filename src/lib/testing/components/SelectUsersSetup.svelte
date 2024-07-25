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
			currentUsername: 'will',
			selectedUsers: [
				{
					selectorId: 'userId1',
					id: 'userId2',
					username: 'john',
					color: 'bg-red-300'
				},
				{
					selectorId: 'userId1',
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
