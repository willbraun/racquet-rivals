<script lang="ts">
	let show = $state(false)

	const toggleShow = () => (show = !show)

	interface Props {
		password?: string
	}

	let { password = $bindable('') }: Props = $props()
</script>

<label for="password">
	<p class="mb-1">Password</p>
	<div class="relative">
		<input
			id="password"
			class="input rounded-md"
			type={show ? 'text' : 'password'}
			name="password"
			data-testid="PasswordField"
			oninput={(e) => (password = e.currentTarget.value)}
		/>
		<button
			type="button"
			class="variant-glass-primary btn btn-sm absolute right-1.5 top-1/2 w-14 -translate-y-1/2 rounded-md"
			onclick={toggleShow}
		>
			{show ? 'Hide' : 'Show'}
		</button>
	</div>
</label>
