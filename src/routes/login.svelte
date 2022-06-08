<script>
	import { directus } from '../lib/directus';
	import { goto } from '$app/navigation';
	import Button from '../lib/components/Button.svelte';
	let email, password;
	const login = async () => {
		try {
			await directus.auth.login({ email, password });
			goto('/');
		} catch (e) {
			console.log(e);
		}
	};
</script>

<div class="w-full">
	<h1 class="text-4xl font-bold mb-2 font-heading">Log In</h1>
	<form on:submit|preventDefault={login} class="flex flex-col">
		<label for="email" class="my-4">
			Email
			<input id="email" type="email" name="email" bind:value={email} required class="input" />
		</label>
		<label for="password" class="my-4"
			>Password
			<input
				id="password"
				type="password"
				name="password"
				bind:value={password}
				required
				minlength="8"
			/>
		</label>
		<Button type="submit" colour="emerald" clickHandler={login}>Submit</Button>
	</form>
</div>

<style>
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
</style>
