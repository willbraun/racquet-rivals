<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton'
	import type { SelectUserResult } from '$lib/types'
	import { applyAction, enhance } from '$app/forms'
	import FormError from '$lib/components/FormError.svelte'
	import { addUser, makeSetType, removeUser } from '$lib/utils'
	import { mainColor } from '$lib/data'
	import { fade } from 'svelte/transition'
	import { selectedUsers } from '$lib/store'
	import x from '$lib/images/icons/x.svg'
	let { parent } = $props()

	const modalStore = getModalStore()

	let value = $state('')
	let selectLoading = $state(false)
	let error = $state('')
	let currentUserId = $modalStore[0]?.meta?.currentUserId
	let currentUsername = $modalStore[0]?.meta?.currentUsername
	let selections = $derived([...$selectedUsers.filter((user) => user.selectorId === currentUserId)])

	let inputRef: HTMLInputElement | null = $state(null)
	const refocus = () => {
		inputRef?.focus()
	}

	const setTypeSelect = makeSetType<SelectUserResult>()

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 bg-white'
	const cHeader = 'text-2xl font-bold'
	const cForm = 'rounded-container-token'
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<h2 class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</h2>
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
			<FormError {error} />
		</form>

		<div class="flex flex-wrap gap-2">
			<div
				class="variant-filled chip pointer-events-none break-all rounded-full text-black {mainColor} shadow"
			>
				<p>{$modalStore[0].meta.currentUsername}</p>
			</div>
			{#each selections as user}
				<button
					type="button"
					class="variant-filled chip max-w-full rounded-full text-black {user.color} shadow"
					onclick={() => removeUser(user.id)}
					transition:fade={{ duration: 100 }}
				>
					<p class="truncate text-ellipsis">{user.username}</p>
					<img src={x} alt="close" width="12" />
				</button>
			{/each}
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="variant-glass-primary btn rounded-md" onclick={parent.onClose}>Close</button>
		</footer>
	</div>
{/if}
