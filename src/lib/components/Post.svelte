<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import Video from '$lib/components/Video.svelte';
	import Audio from '$lib/components/Audio.svelte';
	import type { Post } from '@prisma/client';
	import { currentPost, resetCurrentPost } from '$lib/stores/currentPost';
	import { invalidate } from '$app/navigation';
	export let post: Post & { files: string[] };

	const deletePost = async () => {
		await fetch('/', { method: 'DELETE', body: JSON.stringify({ id: post.id }) });
		invalidate('/');
	};
</script>

<article class="post">
	{#if post.title}
		<h2 class="post-title">{post.title}</h2>{/if}
	{#if post.text}
		{#if post.type === 'quote'}
			<blockquote class="post-text">{@html post.text.trim()}</blockquote>
		{:else}
			<div class="post-text">{@html post.text}</div>
		{/if}
	{/if}
	{#if post.type === 'photo'}
		{#each post.files as photo}
			<Image id={photo} />
		{/each}
	{:else if post.type === 'video'}
		{#each post.files as video}
			<Video id={video} />
		{/each}
	{:else if post.type === 'audio'}
		{#each post.files as audio}
			<Audio id={audio} />
		{/each}
	{/if}
	<div class="meta">
		{#if post.post_date}
			<small class="post-date"
				>{new Date(post.post_date).toLocaleDateString('en-GB', {
					weekday: 'short',
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				})}</small
			>{/if}
		<div class="button-controls">
			<button class="edit-button" on:click={() => ($currentPost = post)}>...</button>
			<button class="delete-button" on:click={deletePost}>&times;</button>
		</div>
	</div>
</article>

<style lang="scss">
	section {
		@apply font-sans;
	}

	.button-panel {
		@apply grid grid-cols-5 my-8 gap-4 items-center;
	}

	.action-button-emerald {
		@apply bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 shadow-lg;
	}
	.styleable-backdrop {
		@apply fixed top-0 left-0 right-0 bottom-0 bg-gray-900 pointer-events-none z-10;
	}
	dialog {
		@apply rounded p-0 max-w-prose w-full;
		&::backdrop {
			@apply hidden;
		}

		header {
			@apply shadow-lg;
			.container {
				@apply p-8 flex justify-between items-center;
				h2 {
					@apply font-bold text-3xl;
				}
				.close-button {
					@apply px-2 text-4xl focus:outline-none active:outline-none;
				}
			}
		}

		footer {
			@apply p-4;

			.container {
				@apply flex w-full gap-2;
			}
		}
	}
	.content {
		@apply p-4;
	}

	.post {
		@apply relative my-8 font-serif;
		.post-title {
			@apply font-black text-2xl mb-2;
		}
		.post-text {
			@apply whitespace-pre-wrap;
		}
		blockquote.post-text {
			@apply border-black border-l-2 pl-2;
		}
		.meta {
			@apply flex text-emerald-600 items-center;
		}
		.button-controls {
			@apply flex gap-0.5 pl-2;
		}
		.delete-button,
		.edit-button {
			@apply flex justify-center items-center aspect-square border rounded-sm w-4 h-4 text-center text-sm;
		}
	}
</style>
