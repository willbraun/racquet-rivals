<script lang="ts">
	import FormError from '$lib/components/FormError.svelte'
	import { mainColor } from '$lib/data'
	import x from '$lib/images/icons/x.svg'
	import { pb } from '$lib/pocketbase'
	import { currentUser, selectedUsers, selectUsersModalOpen } from '$lib/store'
	import type { SelectedUserNoColor } from '$lib/types'
	import { addUser, errorMessage, removeUser } from '$lib/utils'
	import type { ClientResponseError } from 'pocketbase'
	import { fade } from 'svelte/transition'

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

<div class="space-y-2">
	<div>
		<h2 class="text-2xl font-bold">Select Users</h2>
		<p>Compare predictions with your friends (max of 6 total)</p>
	</div>
	<form class="modal-form rounded-container relative" onsubmit={handleSubmit}>
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
					class="preset-filled-primary-500 btn btn-md rounded-md"
					disabled={selectLoading || selections.length >= 5}>Add</button
				>
			</div>
		</label>
		<FormError {error} />
	</form>
	<div class="flex flex-wrap gap-2">
		<div
			class="preset-filled chip pointer-events-none rounded-full break-all text-black {mainColor} shadow-sm"
		>
			<p>{$currentUser?.username}</p>
		</div>
		{#each selections as user (user.id)}
			<button
				type="button"
				class="preset-filled chip max-w-full rounded-full text-black {user.color} shadow-sm"
				onclick={() => removeUser(user.id)}
				transition:fade={{ duration: 100 }}
			>
				<p class="truncate text-ellipsis">{user.username}</p>
				<img src={x} alt="close" width="12" />
			</button>
		{/each}
	</div>
	<footer class="modal-footer flex justify-end">
		<button
			class="preset-tonal-primary btn rounded-md"
			onclick={() => selectUsersModalOpen.set(false)}>Close</button
		>
	</footer>
</div>
