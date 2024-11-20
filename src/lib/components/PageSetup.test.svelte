<script lang="ts">
	import type { Component } from 'svelte'
	import { initializeStores, storePopup } from '@skeletonlabs/skeleton'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	import { isAuth } from '$lib/store'
	interface Props {
		component: Component<any, any, any>
		data?: object
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
