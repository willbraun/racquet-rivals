<script lang="ts">
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
	import { initializeStores, storePopup } from '@skeletonlabs/skeleton'
	import type { Component } from 'svelte'

	interface Props {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		component: Component<any, any, any>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data?: any
	}

	let { component, data = {} }: Props = $props()

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	initializeStores()
</script>

{#if Object.keys(data).length > 0}
	{@const SvelteComponent = component}
	<SvelteComponent {data} />
{:else}
	{@const SvelteComponent_1 = component}
	<SvelteComponent_1 />
{/if}
