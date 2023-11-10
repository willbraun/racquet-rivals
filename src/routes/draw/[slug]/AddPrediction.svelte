<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton'

	let comboboxValue: string
</script>

<button type="button" class="btn h-6 border border-black border-dashed"> Add </button>

<div class="card p-4 variant-filled-primary z-[9999]">
	<ListBox rounded="rounded-none">
		<ListBoxItem bind:group={comboboxValue} name="medium" value="books">Books</ListBoxItem>
		<ListBoxItem bind:group={comboboxValue} name="medium" value="movies">Movies</ListBoxItem>
		<ListBoxItem bind:group={comboboxValue} name="medium" value="none">None</ListBoxItem>
	</ListBox>
</div>
