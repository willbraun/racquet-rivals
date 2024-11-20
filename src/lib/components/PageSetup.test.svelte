<script lang="ts">
	import { initializeStores, storePopup } from '@skeletonlabs/skeleton'
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom'
	interface Props {
		component: ConstructorOfATypedSvelteComponent
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
