<script lang="ts">
	export let id = '';
</script>

<audio controls class="post-audio" preload="metadata">
	<source src="{import.meta.env.VITE_ASSET_BASE_PATH}/files/{id}" />
</audio>

<style lang="scss">
	.post-audio {
		@apply w-full my-4;
	}
</style>
