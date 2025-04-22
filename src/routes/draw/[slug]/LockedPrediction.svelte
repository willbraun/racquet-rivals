<script lang="ts">
	import lock from '$lib/images/icons/lock-solid.svg'
	import type { Draw } from '$lib/types'
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton'

	interface Props {
		draw: Draw
	}
	let { draw }: Props = $props()

	const modalStore = getModalStore()
	let modal: ModalSettings = {
		type: 'component',
		component: 'lockedDrawPricing',
		title: 'Purchase Entry',
		body: `Choose your plan to enter the ${draw.name} ${draw.event} draw`,
		backdropClasses: 'bg-surface-500',
		meta: {
			draw
		}
	}
</script>

<button
	type="button"
	class="chip relative flex h-6 w-fit items-center justify-between rounded-full border border-dashed border-black bg-slate-300 text-black duration-0"
	onclick={() => modalStore.trigger(modal)}
>
	<div>
		<p class="text-xs">Add</p>
	</div>
	<img src={lock} alt="lock" width="12" />
</button>
