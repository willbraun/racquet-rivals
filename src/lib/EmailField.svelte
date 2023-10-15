<script lang="ts">
	let showValidation = false

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

	export let email = ''
</script>

<label class="label">
	<span>Email</span>
	<input
		class="input rounded-md"
		type="text"
		class:input-error={showValidation}
		bind:value={email}
		on:change={handleEmailValidation}
	/>
	<p class="text-red-500 text-xs" class:invisible={!showValidation}>
		Please enter a valid email address
	</p>
</label>
