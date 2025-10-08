<script lang="ts">
	import FormError from '$lib/components/FormError.svelte'
	import { mainColor } from '$lib/data'
	import x from '$lib/images/icons/x.svg'
	import { pb } from '$lib/pocketbase'
	import { currentUser, selectedUsers } from '$lib/store'
	import type { SelectedUserNoColor } from '$lib/types'
	import { addUser, errorMessage, removeUser } from '$lib/utils'
	import { getModalStore } from '@skeletonlabs/skeleton'
	import type { ClientResponseError } from 'pocketbase'
	import { fade } from 'svelte/transition'

	let { parent } = $props()

	const modalStore = getModalStore()

	let username = $state('')
	let selectLoading = $state(false)
	let error = $state('')
	let selections = $derived([
		...$selectedUsers.filter((user) => user.selectorId === $currentUser?.id)
	])

	let inputRef: HTMLInputElement | null = $state(null)
	const refocus = () => {
		inputRef?.focus()
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4 bg-white'
	const cHeader = 'text-2xl font-bold'
	const cForm = 'rounded-container-token'

	const handleSubmit = async (event: Event) => {
		event.preventDefault()
		selectLoading = true

		try {
			if (!$currentUser) {
				error = 'Error: Must be logged in to select users'
				return
			}

			if (username === '') {
				error = 'Please enter a username'
				return
			}

			const takenNames = [$currentUser.username, ...selections.map((user) => user.username)]
			if (takenNames.some((name) => name.toLowerCase() === username.toLowerCase())) {
				error = `User is already selected`
				return
			}

			// search for username, case insensitive
			const user = await pb
				.collection('user')
				.getFirstListItem(`username~"${username}"&&"${username}"~username&&email!=""`)
			const userNoColor = {
				selectorId: $currentUser.id,
				id: user.id,
				username: user.username
			} as SelectedUserNoColor

			await addUser(userNoColor)
			username = ''
			error = ''
		} catch (e) {
			const statusCode = (e as ClientResponseError).status
			if (statusCode === 404) {
				error = 'Error: 404 - Username not found'
			} else {
				error = errorMessage(e)
			}
		} finally {
			selectLoading = false
			refocus()
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<h2 class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</h2>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form relative {cForm}" onsubmit={handleSubmit}>
			<label class="label">
				<span>Username</span>
				<div class="flex gap-2">
					<input
						class="input grow rounded-md"
						type="text"
						name="username"
						bind:value={username}
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
				class="variant-filled chip pointer-events-none break-all rounded-full text-black {mainColor} shadow-sm"
			>
				<p>{$currentUser?.username}</p>
			</div>
			{#each selections as user (user.id)}
				<button
					type="button"
					class="variant-filled chip max-w-full rounded-full text-black {user.color} shadow-sm"
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
