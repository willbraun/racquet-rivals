<script lang="ts">
	import { page } from '$app/stores'

	// export let data: { slug: string }
</script>

<p>Slug: {$page.params.slug}</p>
<slot />
