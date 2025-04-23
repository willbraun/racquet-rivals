<script lang="ts">
	import lock from '$lib/images/icons/lock-solid.svg'
	import type { Draw } from '$lib/types'
	import {
		getDrawerStore,
		getModalStore,
		type DrawerSettings,
		type ModalSettings
	} from '@skeletonlabs/skeleton'
	import { isMobile } from '$lib/store'

	interface Props {
		draw: Draw
	}
	let { draw }: Props = $props()

	const modalStore = getModalStore()
	let modal: ModalSettings = {
		type: 'component',
		component: 'drawPricingModal',
		title: 'Purchase Entry',
		backdropClasses: 'bg-surface-500',
		meta: {
			draw
		}
	}

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: 'draw-pricing',
		position: 'bottom',
		height: 'h-5/6',
		meta: {
			draw
		}
	}

	const handleClick = () => {
		if ($isMobile) {
			drawerStore.open(drawerSettings)
		} else {
			modalStore.trigger(modal)
		}
	}
</script>

<button
	type="button"
	class="chip relative flex h-6 w-fit items-center justify-between rounded-full border border-dashed border-black bg-slate-300 text-black duration-0"
	onclick={handleClick}
>
	<div>
		<p class="text-xs">Add</p>
	</div>
	<img src={lock} alt="lock" width="12" />
</button>
