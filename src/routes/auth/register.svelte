<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<div class="login-container">
	<form method="post">
		<label>Name <input type="text" id="name" name="name" placeholder="Joe Innes" /> </label>
		<label
			>Email <input type="email" id="email" name="email" placeholder="joe@traist.co.uk" />
		</label>
		<label
			>Password <input type="password" id="password" name="password" placeholder="Password" />
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
