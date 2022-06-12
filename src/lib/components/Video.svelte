<script lang="ts">
	export let id = '';
	let video: HTMLVideoElement;
	let show = false;
	import Cog from '$lib/icons/Cog.svelte';
</script>

{#if show || import.meta.env.VITE_AUTOPLAY_VIDEOS === 'true'}
	<video
		src="{import.meta.env.VITE_ASSET_BASE_PATH}/files/{id}"
		class="post-video"
		controls
		autoplay
		muted
	/>
{:else}
	<div class="video-placeholder" on:click={() => (show = true)}>
		<Cog classToApply="h-16 w-16 stroke-1 stroke-emerald-700" />
	</div>
{/if}

<style lang="scss">
	.video-placeholder {
		@apply aspect-video my-4 shadow-lg shadow-emerald-500/20 flex flex-col justify-center items-center bg-emerald-50;
	}
	.post-video {
		@apply w-full aspect-video my-4 shadow-lg shadow-emerald-500/20;
	}
</style>
