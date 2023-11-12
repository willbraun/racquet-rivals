<script lang="ts">
	import '../app.postcss'
	import { Modal, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton'
	import SelectUsers from './draw/[slug]/SelectUsers.svelte'

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	import { storePopup } from '@skeletonlabs/skeleton'
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	const modalRegistry: Record<string, ModalComponent> = {
		selectUsers: { ref: SelectUsers }
	}

	initializeStores()
</script>

<Modal components={modalRegistry} />
<slot />
