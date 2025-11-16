<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/state'
	import NavMenuContent from '$lib/components/NavMenuContent.svelte'
	import ShareLinkContent from '$lib/components/ShareLinkContent.svelte'
	import { initPocketbase } from '$lib/pocketbase'
	import {
		currentUser,
		drawNavUrl,
		isMobile,
		navMenuOpen,
		selectUsersModalOpen,
		shareLinkOpen,
		slotStatsOpen
	} from '$lib/store'
	import type { RootLayoutData } from '$lib/types'
	import { getSlug } from '$lib/utils'
	import { Dialog } from '@skeletonlabs/skeleton-svelte'
	import { type Snippet } from 'svelte'
	import '../app.css'
	import Footer from '../lib/components/Footer.svelte'
	import SlotStats from '../lib/components/SlotStats.svelte'
	import SelectUsers from './draw/[slug]/SelectUsers.svelte'

	interface Props {
		data: RootLayoutData
		children?: Snippet
	}

	let { data, children }: Props = $props()

	initPocketbase()

	// Initialize with server data so authenticated content is available on first render
	currentUser.set(data.cookieCurrentUser)

	afterNavigate(() => {
		if ($drawNavUrl === '') {
			const url = `/draw/${getSlug(data.defaultDraw)}`
			drawNavUrl.set(url)
		}
	})
</script>

<svelte:head>
	<title>{`${page.data.title ? `${page.data.title} | ` : ''} Racquet Rivals`}</title>
	<meta
		name="description"
		content={page.data.description ??
			'Your fantasy tennis community. Predict match winners and compete with fellow fans!'}
	/>
</svelte:head>

<!-- Select Users Modal -->
<Dialog
	open={$selectUsersModalOpen}
	onOpenChange={(details: { open: boolean }) => selectUsersModalOpen.set(details.open)}
>
	<Dialog.Backdrop class="bg-surface-500/50 fixed inset-0 z-50" />
	<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
		<Dialog.Content
			class="card w-modal border-surface-300-700 mx-4 space-y-4 rounded-xl border bg-white p-6 shadow-xl md:w-xl"
		>
			<SelectUsers />
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>

<!-- Slot Stats Drawer -->
<Dialog
	open={!!$slotStatsOpen}
	onOpenChange={(details: { open: boolean }) =>
		slotStatsOpen.set(details.open ? $slotStatsOpen : null)}
>
	<Dialog.Backdrop class="bg-surface-500/50 fixed inset-0 z-50" />
	{#if $isMobile}
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-end">
			<Dialog.Content
				class="h-1/2 w-full translate-y-full opacity-0 shadow-xl transition transition-discrete data-[state=open]:translate-y-0 data-[state=open]:opacity-100 starting:data-[state=open]:translate-y-full starting:data-[state=open]:opacity-0"
			>
				<SlotStats slotId={$slotStatsOpen} />
			</Dialog.Content>
		</Dialog.Positioner>
	{:else}
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-end">
			<Dialog.Content
				class="h-screen w-64 translate-x-full bg-white opacity-0 shadow-xl transition transition-discrete data-[state=open]:translate-x-0 data-[state=open]:opacity-100 starting:data-[state=open]:translate-x-full starting:data-[state=open]:opacity-0"
			>
				<SlotStats slotId={$slotStatsOpen} />
			</Dialog.Content>
		</Dialog.Positioner>
	{/if}
</Dialog>

<!-- Share Link Drawer -->
<Dialog
	open={$shareLinkOpen}
	onOpenChange={(details: { open: boolean }) => shareLinkOpen.set(details.open)}
>
	<Dialog.Backdrop class="bg-surface-500/50 fixed inset-0 z-50" />
	<Dialog.Positioner class="fixed inset-0 z-50 flex items-end">
		<Dialog.Content
			class="h-1/2 w-full translate-y-full opacity-0 shadow-xl transition transition-discrete data-[state=open]:translate-y-0 data-[state=open]:opacity-100 starting:data-[state=open]:translate-y-full starting:data-[state=open]:opacity-0"
		>
			<ShareLinkContent />
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>

<!-- Nav Menu Drawer -->
<Dialog
	open={$navMenuOpen}
	onOpenChange={(details: { open: boolean }) => navMenuOpen.set(details.open)}
>
	<Dialog.Backdrop class="bg-surface-500/50 fixed inset-0 z-50" />
	<Dialog.Positioner class="fixed inset-0 z-50 flex justify-end">
		<Dialog.Content
			class="h-screen w-64 translate-x-full bg-white opacity-0 shadow-xl transition transition-discrete data-[state=open]:translate-x-0 data-[state=open]:opacity-100 starting:data-[state=open]:translate-x-full starting:data-[state=open]:opacity-0"
		>
			<NavMenuContent />
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog>

<div class="flex min-h-screen flex-col">
	<div class="grow">
		{@render children?.()}
	</div>
	<Footer />
</div>
