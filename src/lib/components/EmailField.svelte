<script lang="ts">
	interface Props {
		email?: string;
		showValidation?: boolean;
	}

	let { email = $bindable(''), showValidation = $bindable(false) }: Props = $props();

	const isValidEmail = (value: string) => {
		return !!value.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	}

	const handleEmailValidation = () => {
		if (email === '') {
			showValidation = false
			return
		}
		showValidation = !isValidEmail(email)
	}
</script>

<label class="label">
	<p>Email</p>
	<input
		class="input rounded-md"
		type="text"
		name="email"
		data-testid="EmailField"
		class:input-error={showValidation}
		bind:value={email}
		onchange={handleEmailValidation}
	/>
	<p
		class="text-red-500 text-xs my-0"
		class:invisible={!showValidation}
		data-testid="EmailFieldError"
	>
		Please enter an email address with a valid format
	</p>
</label>
