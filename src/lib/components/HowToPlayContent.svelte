<script lang="ts">
	import { onMount } from 'svelte'
	import { getModalStore } from '@skeletonlabs/skeleton'
	let { parent } = $props()

	const modalStore = getModalStore()

	const scoreFormatting = 'font-bold bg-green-300 rounded-full px-1.5 shadow'

	let buttonRef: HTMLButtonElement | null = $state(null)
	onMount(() => {
		if (buttonRef) {
			buttonRef.blur()
		}
	})
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 scroll-smooth bg-white p-4 shadow-xl">
		<h2 class="text-2xl font-bold">{$modalStore[0].title ?? '(title missing)'}</h2>
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
					12 hours to create your bracket for the <b>entire rest of the tournament</b>. After this
					time, you <b>cannot</b> add any more predictions. You may choose your players before this point
					for any that are available in the Round of 16.
				</li>
				<li>As matches are completed, you'll win points if your predictions are correct.</li>
				<ul class="mb-4 ml-8 list-disc">
					<li>Quarterfinals: <span class={scoreFormatting}>1</span></li>
					<li>Semifinals: <span class={scoreFormatting}>2</span></li>
					<li>Final: <span class={scoreFormatting}>4</span></li>
					<li>Champion: <span class={scoreFormatting}>8</span></li>
				</ul>
				<li>
					Enter your friends' usernames in the Users menu to see their picks and compare scores!
				</li>
			</ol>
		</article>
		<footer class="modal-footer {parent.regionFooter}">
			<button
				class="variant-glass-primary btn rounded-md"
				bind:this={buttonRef}
				onclick={parent.onClose}>Close</button
			>
		</footer>
	</div>
{/if}
