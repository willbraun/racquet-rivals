<script lang="ts">
	interface Props {
		error?: string;
	}

	let { error = '' }: Props = $props();
</script>

<p class="text-md text-red-500 whitespace-pre-line">{error}</p>
