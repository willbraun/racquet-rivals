<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte'
	import { getModalStore } from '@skeletonlabs/skeleton'
	export let parent: SvelteComponent

	const modalStore = getModalStore()

	const scoreFormatting = 'font-bold bg-green-300 rounded-full px-1.5 shadow'

	let buttonRef: HTMLButtonElement
	onMount(() => {
		if (buttonRef) {
			buttonRef.blur()
		}
	})
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4 bg-white scroll-smooth">
		<header class="text-2xl font-bold">{$modalStore[0].title ?? '(title missing)'}</header>
		<article>
			<p class="mb-4">Welcome to Racquet Rivals! Follow these steps to join the fun.</p>
			<ol class="list-decimal px-8">
				<li class="mb-4">
					Create an account. Choose a username, as well as an email address to receive
					notifications.
				</li>
				<li class="mb-4">Select an active tournament and follow along.</li>
				<li class="mb-4">
					When all slots in the Round of 16 have been filled, you'll be notified via email and have
					12 hours to create your bracket. You may enter predictions before this point for any
					available players.
				</li>
				<li>As matches are completed, you'll win points if your predictions are correct.</li>
				<ul class="list-disc ml-8 mb-4">
					<li>Quarterfinals: <span class={scoreFormatting}>1</span></li>
					<li>Semifinals: <span class={scoreFormatting}>2</span></li>
					<li>Final: <span class={scoreFormatting}>4</span></li>
					<li>Champion: <span class={scoreFormatting}>8</span></li>
				</ul>
				<li>Enter your friends' usernames in the Users menu to see how you stack up!</li>
			</ol>
		</article>
		<footer class="modal-footer {parent.regionFooter}">
			<button
				class="btn rounded-md variant-glass-primary"
				bind:this={buttonRef}
				on:click={parent.onClose}>Close</button
			>
		</footer>
	</div>
{/if}
