<script lang="ts">
	let { slotId }: { slotId: string | null } = $props()
</script>

<div class="flex h-full w-full flex-col items-center gap-8 bg-white p-4">
	Slot Stats for slot ID: {slotId}
</div>
