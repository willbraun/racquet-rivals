<script lang="ts">
	interface Props {
		error?: string
	}

	let { error = '' }: Props = $props()
</script>

<p class="text-md whitespace-pre-line text-red-500">{error}</p>
