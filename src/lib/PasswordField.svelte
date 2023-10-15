<script lang="ts">
	let show = false

	const toggleShow = () => (show = !show)

	export let password = ''
</script>

<label for="password">
	<p class="mb-1">Password</p>
	<div class="relative">
		<input
			id="password"
			class="input rounded-md"
			type={show ? 'text' : 'password'}
			on:input={(e) => (password = e.currentTarget.value)}
		/>
		<button
			type="button"
			class="btn btn-sm rounded-md variant-ghost w-14 absolute right-1.5 top-1/2 -translate-y-1/2"
			on:click={toggleShow}
		>
			{show ? 'Hide' : 'Show'}
		</button>
	</div>
</label>
