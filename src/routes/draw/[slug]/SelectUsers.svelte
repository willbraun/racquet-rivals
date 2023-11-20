<script lang="ts">
	import type { SvelteComponent } from 'svelte'
	import { getModalStore } from '@skeletonlabs/skeleton'
	import type { DeselectUserResult, SelectUserResult, SelectedUser } from '../../../lib/types'
	import { applyAction, enhance } from '$app/forms'
	import type { ActionResult } from '@sveltejs/kit'
	import FormError from '../../../lib/FormError.svelte'
	import { mainColor } from '../../../lib/utils'
	export let parent: SvelteComponent

	const modalStore = getModalStore()

	let value = ''
	let selectLoading = false
	let deselectLoading = false
	let error = ''
	let deletedUserId = ''
	let users: SelectedUser[] = $modalStore[0].meta.selectedUsers

	let inputRef: HTMLInputElement
	const refocus = () => {
		inputRef.focus()
	}

	const setTypeSelect = (result: ActionResult) => {
		return result as SelectUserResult
	}

	const setTypeDeselect = (result: ActionResult) => {
		return result as DeselectUserResult
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4'
	const cHeader = 'text-2xl font-bold'
	const cForm = 'rounded-container-token'
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form
			class="modal-form relative {cForm}"
			method="POST"
			action="?/selectUser"
			use:enhance={() => {
				selectLoading = true
				return async ({ result, update }) => {
					await applyAction(result)
					await update()
					const typedResult = setTypeSelect(result)
					if (result.status === 200) {
						users = [...users, typedResult.data.user]
						error = ''
					} else {
						error = typedResult.data.error
					}
					selectLoading = false
					refocus()
				}
			}}
		>
			<label class="label">
				<span>Username</span>
				<div class="flex gap-2">
					<input
						class="input flex-grow rounded-md"
						type="text"
						name="username"
						bind:value
						bind:this={inputRef}
					/>
					<button class="btn btn-md variant-filled rounded-md" disabled={selectLoading}>Add</button>
				</div>
			</label>
			<FormError bind:error />
		</form>
		<form
			class="flex gap-1"
			method="POST"
			action="?/deselectUser"
			use:enhance={() => {
				deselectLoading = true
				return async ({ result, update }) => {
					if (result.status === 200) {
						await applyAction(result)
						await update()
						const typedResult = setTypeDeselect(result)
						const index = users.map((user) => user.id).indexOf(typedResult.data.deletedId)
						users = users.toSpliced(index, 1)
					}
					deselectLoading = false
					refocus()
				}
			}}
		>
			{#if $modalStore[0].meta.currentUsername}
				<div
					class={`chip variant-filled rounded-full pointer-events-none text-black ${mainColor} shadow`}
				>
					<p>{$modalStore[0].meta.currentUsername}</p>
				</div>
			{/if}
			<input type="hidden" name="userId" bind:value={deletedUserId} />
			{#each users as user}
				<button
					type="submit"
					class={`chip variant-filled rounded-full text-black ${user.color} shadow`}
					disabled={deletedUserId === user.id && deselectLoading}
					on:click={() => (deletedUserId = user.id)}
				>
					<p>{user.username}</p>
					<svg xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 0 384 512"
						><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
							d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
						/></svg
					>
				</button>
			{/each}
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn rounded-xl {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
		</footer>
	</div>
{/if}