<script lang="ts">
	import '../app.postcss'
	import { Modal, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton'
	import SelectUsers from './draw/[slug]/SelectUsers.svelte'

	const modalRegistry: Record<string, ModalComponent> = {
		selectUsers: { ref: SelectUsers }
	}

	initializeStores()
</script>

<Modal components={modalRegistry} />
<slot />
