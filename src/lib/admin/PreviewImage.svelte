<script lang="ts">
	import { currentPost } from '$lib/stores/currentPost';
	import Cog from '../icons/Cog.svelte';
	export let id = '';
	export let alt = '';
	let failed = false;
	let loaded = false;
	const imageLoaded = () => {
		loaded = true;
	};
	const disconnectFile = () => {
		$currentPost.files = $currentPost.files?.filter((file) => {
			return file !== id;
		});
	};
</script>

<div class="image-container {loaded && 'image-loaded'}">
	{#if id}
		<img
			on:load={imageLoaded}
			on:error={() => (failed = true)}
			src="{import.meta.env.VITE_ASSET_BASE_PATH}/files/{id}"
			class={loaded ? 'block' : 'hidden'}
			alt="Sorry, no alt text"
		/>
		{#if failed}
			<object
				data="{import.meta.env.VITE_ASSET_BASE_PATH}/files/{id}"
				type="image/svg+xml"
				title={alt}
			/>
		{:else}
			<img
				on:error={() => (failed = true)}
				src="{import.meta.env.VITE_ASSET_BASE_PATH}/files/{id}"
				loading="lazy"
				{alt}
			/>
		{/if}
		<button class="disconnect" on:click|stopPropagation={disconnectFile}>&times;</button>
	{/if}
	<Cog classToApply={loaded ? 'hidden' : 'stroke-1 stroke-white animate-spin'} />
</div>

<style lang="scss">
	.image-container {
		@apply flex flex-row items-center space-x-2 bg-gray-400 relative;
		img {
			@apply aspect-square object-contain;
		}
		.disconnect {
			@apply absolute bg-red-400 text-white top-0 right-0 rounded-full w-4 h-4 text-xs z-20 cursor-pointer;
		}
	}
	.image-loaded {
		@apply bg-inherit;
	}
</style>
