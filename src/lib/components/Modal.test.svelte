<script lang="ts">
	import { type ModalComponent } from '@skeletonlabs/skeleton-svelte'
	import SelectUsers from '$lib/../routes/draw/[slug]/SelectUsers.svelte'

	const modalRegistry: Record<string, ModalComponent> = {
		selectUsers: { ref: SelectUsers }
	}
</script>

<Modal components={modalRegistry} />
