<script lang="ts">
	interface Props {
		value?: string
	}

	let { value = $bindable('') }: Props = $props()
</script>

<label class="absolute -left-[9999px]" aria-hidden="true">
	<input name="nickname" type="text" autocomplete="off" bind:value />
</label>
