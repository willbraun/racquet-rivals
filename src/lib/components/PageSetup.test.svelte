<script lang="ts">
	import type { Component } from 'svelte'

	interface Props {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		component: Component<any, any, any>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data?: any
	}

	let { component, data = {} }: Props = $props()
</script>

{#if Object.keys(data).length > 0}
	{@const SvelteComponent = component}
	<SvelteComponent {data} />
{:else}
	{@const SvelteComponent_1 = component}
	<SvelteComponent_1 />
{/if}
