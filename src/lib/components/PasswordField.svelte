<script lang="ts">
	let show = $state(false)

	const toggleShow = () => (show = !show)

	interface Props {
		password?: string;
	}

	let { password = $bindable('') }: Props = $props();
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
			class="btn btn-sm rounded-md variant-glass-primary w-14 absolute right-1.5 top-1/2 -translate-y-1/2"
			onclick={toggleShow}
		>
			{show ? 'Hide' : 'Show'}
		</button>
	</div>
</label>
