<script lang="ts">
	import { currentPost } from '$lib/stores/currentPost';
	import Cog from '../icons/Cog.svelte';
	export let id = '';
	export let loading = false;
	let loaded = false;
	let image: HTMLImageElement;
	const imageLoaded = () => {
		loaded = true;
		console.log('loaded');
	};
	const svgTest = () => {
		const svg = image.innerHTML.trim();
		const svgUrl = `data:image/svg+xml;base64,${window.btoa(svg)}`;
		image.src = svgUrl;
	};
	const disconnectFile = () => {
		console.log($currentPost.files, id);
		$currentPost.files = $currentPost.files?.filter((file) => {
			return file !== id;
		});
	};
</script>

<div class="image-container {loaded && 'image-loaded'}">
	{#if id}
		<img
			on:load={imageLoaded}
			on:error={svgTest}
			src="{import.meta.env.VITE_ASSET_BASE_PATH}/files/{id}"
			class={loaded ? 'block' : 'hidden'}
			alt="Sorry, no alt text"
			bind:this={image}
		/>
		<button class="disconnect" on:click|stopPropagation={disconnectFile}>&times;</button>
	{/if}
	<Cog classToApply={loaded ? 'hidden' : 'stroke-1 stroke-white animate-spin'} />
</div>

<style lang="scss">
	.image-container {
		@apply flex flex-row items-center space-x-2 bg-gray-400 relative;
		image {
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
