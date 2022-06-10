<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div class="login-container">
	<h1>Log In</h1>
	<form method="post">
		<label for="email">
			Email
			<input id="email" type="email" name="email" required />
		</label>
		<label for="password"
			>Password
			<input id="password" type="password" name="password" required minlength="8" />
		</label>
		<Button type="submit" colour="emerald">Submit</Button>
	</form>
</div>

<style lang="scss">
	.login-container {
		@apply w-full;
		h1 {
			@apply text-4xl font-bold mb-2 font-heading;
		}
		form {
			@apply flex flex-col;
		}
		label {
			@apply my-4;
			input {
				@apply block
    border-2
    rounded
    w-full
    p-2
    border-emerald-200
    focus:shadow-lg focus:shadow-emerald-600/20
    outline-none
    hover:border-emerald-400
    transition-colors
    duration-200;
			}
		}
	}
</style>
