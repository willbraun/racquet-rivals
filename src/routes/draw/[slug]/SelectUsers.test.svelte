<script lang="ts">
	import { selectUsersModalOpen } from '$lib/store'
	import SelectUsers from './SelectUsers.svelte'

	selectUsersModalOpen.set(true)
</script>

<SelectUsers />
