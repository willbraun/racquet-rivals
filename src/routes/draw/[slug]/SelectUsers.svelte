<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton'
	import type { SelectUserResult } from '$lib/types'
	import { applyAction, enhance } from '$app/forms'
	import FormError from '$lib/components/FormError.svelte'
	import { addUser, mainColor, makeSetType, removeUser } from '$lib/utils'
	import { fade } from 'svelte/transition'
	import { selectedUsers } from '$lib/store'
	export let parent

	const modalStore = getModalStore()

	let value = ''
	let selectLoading = false
	let error = ''
	let currentUserId = $modalStore[0]?.meta?.currentUserId
	let currentUsername = $modalStore[0]?.meta?.currentUsername
	$: selections = [...$selectedUsers.filter((user) => user.selectorId === currentUserId)]

	let inputRef: HTMLInputElement
	const refocus = () => {
		inputRef.focus()
	}

	const setTypeSelect = makeSetType<SelectUserResult>()

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
				return async ({ formData, result, update }) => {
					const username = (formData.get('username') ?? '').toString().trim()
					if (username === '') {
						error = 'Please enter a username'
						selectLoading = false
						refocus()
						return
					}

					const takenNames = [currentUsername, ...selections.map((user) => user.username)]
					if (takenNames.some((name) => name === username)) {
						error = `User "${username}" is already selected`
						selectLoading = false
						refocus()
						return
					}

					await applyAction(result)
					await update()
					const typedResult = setTypeSelect(result)
					if (result.status === 200) {
						addUser(typedResult.data.user)
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
					<button
						class="variant-filled-primary btn btn-md rounded-md"
						disabled={selectLoading || selections.length >= 5}>Add</button
					>
				</div>
			</label>
			<FormError bind:error />
		</form>

		<div class="flex flex-wrap gap-2">
			<div
				class="variant-filled chip pointer-events-none rounded-full text-black {mainColor} shadow"
			>
				<p>{$modalStore[0].meta.currentUsername}</p>
			</div>
			{#each selections as user}
				<button
					type="button"
					class="variant-filled chip rounded-full text-black {user.color} shadow"
					on:click={() => removeUser(user.id)}
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
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="variant-glass-primary btn rounded-md" on:click={parent.onClose}>Close</button>
		</footer>
	</div>
{/if}
