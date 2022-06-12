<script lang="ts">
	import type { Prisma, Post, File, User } from '@prisma/client';
	import Image from '$lib/components/Image.svelte';
	import Video from '$lib/components/Video.svelte';
	import PostControls from '$lib/admin/PostControls.svelte';
	import postsStore from '$lib/stores/posts';
	import type { PostWithFiles } from '$lib/stores/posts';

	export let user: User | null;
	export let posts: PostWithFiles[];

	let page = 1;
	let canPost = user?.role === 'admin';

	$postsStore = posts;
	const loadMore = async function () {
		page++;
		const res = await fetch(`/?page=${page}`, {
			headers: {
				accept: 'application/json'
			}
		});
		const data: {
			posts: PostWithFiles[];
			user: User;
		} = await res.json();
		posts = [...$postsStore, ...data.posts];
	};
</script>

<div>
	<a href="/"><h1 class="page-title">{import.meta.env.VITE_SITE_NAME}</h1></a>
	{#if canPost}
		<PostControls />
	{/if}

	{#each $postsStore as post}
		<article>
			{#if post.title}
				<h2 class="post-title">{post.title}</h2>{/if}
			{#if post.text}
				<div class="post-text">{@html post.text}</div>
			{/if}
			{#if post.type === 'photo'}
				{#each post.files as photo}
					<Image id={photo.s3id} />
				{/each}
			{:else if post.type === 'video'}
				{#each post.files as video}
					<Video id={video.s3id} />
				{/each}
			{/if}
			{#if post.post_date}
				<small class="post-date"
					>{new Date(post.post_date).toLocaleDateString('en-GB', {
						weekday: 'short',
						day: '2-digit',
						month: 'short',
						year: 'numeric'
					})}</small
				>{/if}
		</article>
	{:else}
		<article>No posts found.</article>
	{/each}
	<button on:click={loadMore}>Load More</button>
	{#if user}
		<a href="/auth/logout">Log out</a>
	{/if}
</div>

<style lang="scss">
	.page-title {
		@apply font-heading font-bold text-6xl;
	}

	article {
		@apply my-8 font-serif;
		.post-title {
			@apply font-black text-2xl mb-2;
		}
		.post-text {
			@apply whitespace-pre-wrap;
		}
		.post-date {
			@apply text-emerald-600;
		}
	}
</style>
