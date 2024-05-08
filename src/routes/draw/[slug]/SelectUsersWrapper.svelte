<!-- used for testing only -->
<script lang="ts">
	import '../app.postcss'
	import { Modal, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton'
	import SelectUsers from './SelectUsers.svelte'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	import { storePopup } from '@skeletonlabs/skeleton'
	import HowToPlayContent from '$lib/HowToPlayContent.svelte'
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	const modalRegistry: Record<string, ModalComponent> = {
		howToPlayContent: { ref: HowToPlayContent },
		selectUsers: { ref: SelectUsers }
	}

	initializeStores()
</script>

<!-- <Modal components={modalRegistry} />
<SelectUsers parent={Modal({ props: { components: modalRegistry } })} /> -->
