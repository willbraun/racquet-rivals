<script lang="ts">
	import { Modal, type ModalComponent } from '@skeletonlabs/skeleton'
	import SelectUsers from '$lib/../routes/draw/[slug]/SelectUsers.svelte'

	const modalRegistry: Record<string, ModalComponent> = {
		selectUsers: { ref: SelectUsers }
	}
</script>

<Modal components={modalRegistry} />
