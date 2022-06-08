<script>
	import Cog from '../icons/Cog.svelte';
	export let id = '';
	export let loading = false;
	let loaded = false;
</script>

<div class="image-container {loaded && 'image-loaded'}">
	{#if id}
		<img
			on:load={() => (loaded = true)}
			src="https://cdn.statically.io/img/api.traist.co.uk/f=auto&w=200/assets/{id}.jpg"
			class={loaded ? 'block' : 'hidden'}
		/>
	{/if}
	<Cog classToApply={loaded ? 'hidden' : 'stroke-1 stroke-white animate-spin'} />
</div>

<style lang="scss">
	.image-container {
		@apply flex flex-row items-center space-x-2 bg-gray-400;
		image {
			@apply aspect-square object-contain;
		}
	}
	.image-loaded {
		@apply bg-inherit;
	}
</style>
