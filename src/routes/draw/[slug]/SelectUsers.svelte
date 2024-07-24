<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton'
	import type { DeselectUserResult, SelectUserResult, SelectedUser } from '../../../lib/types'
	import { applyAction, enhance } from '$app/forms'
	import FormError from '../../../lib/FormError.svelte'
	import { mainColor, makeSetType } from '../../../lib/utils'
	import { fade } from 'svelte/transition'
	import { selectedUsers2 } from '$lib/store'
	import { get } from 'svelte/store'
	export let parent

	const modalStore = getModalStore()

	let value = ''
	let selectLoading = false
	let deselectLoading = false
	let error = ''
	let deletedUserId = ''
	// let users: SelectedUser[] = $modalStore[0]?.meta?.selectedUsers

	let inputRef: HTMLInputElement
	const refocus = () => {
		inputRef.focus()
	}

	const setTypeSelect = makeSetType<SelectUserResult>()
	const setTypeDeselect = makeSetType<DeselectUserResult>()

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 bg-white'
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
						// users = [...users, typedResult.data.user]
						const users = get(selectedUsers2)
						selectedUsers2.set([...users, typedResult.data.user])
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
					<button class="variant-filled-primary btn btn-md rounded-md" disabled={selectLoading}
						>Add</button
					>
				</div>
			</label>
			<FormError bind:error />
		</form>
		<form
			class="flex flex-wrap gap-2"
			method="POST"
			action="?/deselectUser"
			use:enhance={() => {
				deselectLoading = true
				return async ({ result, update }) => {
					if (result.status === 200) {
						await applyAction(result)
						await update()
						const typedResult = setTypeDeselect(result)
						const users = get(selectedUsers2)
						const index = users.map((user) => user.id).indexOf(typedResult.data.deletedId)
						// users = users.toSpliced(index, 1)
						selectedUsers2.set(users.toSpliced(index, 1))
					}
					deselectLoading = false
					refocus()
				}
			}}
		>
			{#if $modalStore[0].meta.currentUsername}
				<div
					class="variant-filled chip pointer-events-none rounded-full text-black {mainColor} shadow"
				>
					<p>{$modalStore[0].meta.currentUsername}</p>
				</div>
			{/if}
			<input type="hidden" name="userId" bind:value={deletedUserId} />
			{#each $selectedUsers2 as user}
				<button
					type="submit"
					class="variant-filled chip rounded-full text-black {user.color} shadow"
					disabled={deletedUserId === user.id && deselectLoading}
					on:click={() => (deletedUserId = user.id)}
					transition:fade={{ duration: 100 }}
				>
					<p>{user.username}</p>
					<svg xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 0 384 512">
						<!--! X icon - Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
						<path
							d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
						/>
					</svg>
				</button>
			{/each}
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="variant-glass-primary btn rounded-md" on:click={parent.onClose}>Close</button>
		</footer>
	</div>
{/if}
