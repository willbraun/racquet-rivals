<script lang="ts">
	import type { SvelteComponent } from 'svelte'
	import { getModalStore } from '@skeletonlabs/skeleton'
	export let parent: SvelteComponent

	const modalStore = getModalStore()

	interface SelectedUser {
		id: string
		name: string
	}

	let value = ''
	const users: SelectedUser[] = [
		{
			id: 'test1',
			name: 'TestUser1'
		},
		{
			id: 'test2',
			name: 'TestUser2'
		}
	]

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4'
	const cHeader = 'text-2xl font-bold'
	const cForm = 'space-y-4 rounded-container-token'
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Username</span>
				<div class="flex gap-2">
					<input class="input flex-grow rounded-md" type="text" bind:value />
					<button class="btn btn-md variant-filled rounded-md">Add</button>
				</div>
			</label>
		</form>
		<div class="flex gap-1">
			{#each users as user}
				<div class="chip variant-filled rounded-full">
					<p>{user.name}{'X'}</p>
				</div>
			{/each}
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn rounded-xl {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
		</footer>
	</div>
{/if}
