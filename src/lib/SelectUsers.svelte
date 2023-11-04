<script lang="ts">
	import type { SvelteComponent } from 'svelte'
	import { getModalStore } from '@skeletonlabs/skeleton'
	import type { SelectUserResult, SelectedUser } from './types'
	import { enhance } from '$app/forms'
	import type { ActionResult } from '@sveltejs/kit'
	import FormError from './FormError.svelte'
	export let parent: SvelteComponent

	const modalStore = getModalStore()

	let value = ''
	let loading = false
	let error = ''
	let users: SelectedUser[] = $modalStore[0].meta.selectedUsers

	const setType = (result: ActionResult) => {
		return result as SelectUserResult
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
				loading = true
				return async ({ result, update }) => {
					await update()
					const typedResult = setType(result)
					if (result.status === 200) {
						users = [...users, typedResult.data.user]
						error = ''
					} else {
						error = typedResult.data.error
					}
					loading = false
				}
			}}
		>
			<label class="label">
				<span>Username</span>
				<div class="flex gap-2">
					<input class="input flex-grow rounded-md" type="text" name="username" bind:value />
					<button class="btn btn-md variant-filled rounded-md" disabled={loading}>Add</button>
				</div>
			</label>
			<div class="">
				<FormError bind:error />
			</div>
		</form>
		<div class="flex gap-1">
			{#if $modalStore[0].meta.currentUsername}
				<div class="chip variant-filled rounded-full">
					<p>{$modalStore[0].meta.currentUsername}</p>
				</div>
			{/if}
			{#each users as user}
				<div class="chip variant-filled rounded-full">
					<p>{user.username}{'X'}</p>
				</div>
			{/each}
		</div>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn rounded-xl {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
		</footer>
	</div>
{/if}
