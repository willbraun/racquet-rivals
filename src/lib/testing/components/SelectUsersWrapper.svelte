<script lang="ts">
	import { getModalStore, initializeStores, type ModalSettings } from '@skeletonlabs/skeleton'
	import TestRootLayout from './TestRootLayout.svelte'
	import SelectUsers from '../../../routes/draw/[slug]/SelectUsers.svelte'

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

<TestRootLayout let:TestModal>
	<SelectUsers parent={TestModal} />
</TestRootLayout>
