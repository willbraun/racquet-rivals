<script lang="ts">
	import { Modal, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton'
	import SelectUsers from './../../../routes/draw/[slug]/SelectUsers.svelte'
	import HowToPlayContent from '$lib/HowToPlayContent.svelte'

	const modalRegistry: Record<string, ModalComponent> = {
		howToPlayContent: { ref: HowToPlayContent },
		selectUsers: { ref: SelectUsers }
	}

	initializeStores()
</script>

<Modal components={modalRegistry} />
