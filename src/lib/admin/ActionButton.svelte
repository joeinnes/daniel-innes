<script lang="ts">
	import type { SvelteComponentTyped } from 'svelte';

	import type { SvelteComponent } from 'svelte';
	export let Icon: typeof SvelteComponent;
	export let clickHandler = () => {};
	export let colour = 'emerald';
</script>

<div on:click={clickHandler} class="action-button action-button-{colour}">
	<svelte:component this={Icon} />
</div>

<style lang="scss">
	.action-button {
		@apply rounded-full p-4 transition-colors duration-200 cursor-pointer max-w-full w-20 aspect-square;
		&-emerald {
			@apply bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 shadow-lg;
		}
		&-amber {
			@apply bg-amber-400 hover:bg-amber-500 shadow-lg shadow-amber-500/20;
		}
		&-sky {
			@apply bg-sky-500 hover:bg-sky-600 shadow-sky-500/20 shadow-lg;
		}
		&-fuchsia {
			@apply bg-fuchsia-500 hover:bg-fuchsia-600 shadow-fuchsia-500/20 shadow-lg;
		}
		&-rose {
			@apply bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 shadow-lg;
		}
	}
</style>
