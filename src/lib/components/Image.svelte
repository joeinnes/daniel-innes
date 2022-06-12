<script lang="ts">
	export let id = '';
	export let alt = 'Sorry, no alt text';
	let image: HTMLImageElement;
	let failed = false;
</script>

<div class="w-full">
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
		/>{/if}
</div>

<style lang="scss">
	img:after {
		display: block;
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	img,
	object {
		@apply w-full h-auto my-4 shadow-lg block relative shadow-emerald-500/20;
	}
</style>
