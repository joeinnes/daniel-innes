<script>
	export let clickHandler = Function.prototype();
	export let colour = 'emerald';
	export let type = '';
	export let fullWidth = false;
	export let disabled = false;
	let shouldDisable = disabled;
	let thisColour = colour;
	let thisClickHandler = clickHandler;
	$: {
		shouldDisable = disabled;
		if (disabled) {
			colour = 'disabled';
			clickHandler = Function.prototype();
		} else {
			colour = thisColour;
			clickHandler = thisClickHandler;
		}
	}
	
</script>

<button
	on:click|preventDefault={clickHandler}
	class="button button-{colour} {fullWidth && 'w-full'}"
	disabled={shouldDisable}
	{type}
>
	<slot>Button</slot>
</button>

<style lang="scss">
	button {
		@apply rounded my-4 p-4 hover:shadow-lg transition-all duration-200 font-black cursor-pointer;
	}

	.button-emerald {
		@apply bg-emerald-600 text-emerald-50 hover:bg-emerald-800 hover:shadow-emerald-600/20;
	}

	.button-gray {
		@apply bg-gray-200 text-gray-900 hover:bg-gray-400 hover:shadow-gray-600/20;
	}

	.button-disabled {
		@apply button-gray cursor-not-allowed;
	}
</style>
