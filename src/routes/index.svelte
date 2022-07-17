<script lang="ts">
	import Post from '$lib/components/Post.svelte';

	import type { Post as PostType, User } from '@prisma/client';

	import PostControls from '$lib/admin/PostControls.svelte';
	import Button from '$lib/components/Button.svelte';
	import postsStore from '$lib/stores/posts';
	import viewport from '$lib/actions/useViewportAction';
	import { goto } from '$app/navigation';

	enum Type {
		Text = 'text',
		Photo = 'photo',
		Video = 'video',
		Audio = 'audio',
		Quote = 'quote',
		None = 'none'
	}

	interface PostsType extends PostType {
		files?: string[];
		type: string;
	}

	export let user: User | null;
	export let posts: Partial<PostsType>[];

	let page = 1;
	let canPost = user?.role === 'admin';
	let canLoadMore = true;

	$postsStore = posts;
	const loadMore = async function () {
		page++;
		const res = await fetch(`/?page=${page}`, {
			headers: {
				accept: 'application/json'
			}
		});
		const data: {
			posts: Partial<PostsType>[];
			user: User;
		} = await res.json();
		if (!data.posts.length) {
			canLoadMore = false;
		}
		posts = [...$postsStore, ...data.posts];
	};
	$: $postsStore = posts;
</script>

<div>
	<div class="flex justify-between items-center">
		<a href="/"><h1 class="page-title">{import.meta.env.VITE_SITE_NAME}</h1></a>
		{#if user}
			<Button clickHandler={() => goto('/auth/logout')} colour="transparent">Log out</Button>
		{/if}
	</div>
	{#if canPost}
		<PostControls />
	{/if}

	{#each $postsStore as post (post.id)}
		<Post {post} />
	{:else}
		<article class="empty-state">No posts found.</article>
	{/each}
	<div use:viewport on:enterViewport={loadMore} class="flex justify-center">
		<Button on:click={loadMore} colour="emerald" disabled={!canLoadMore}
			>{#if canLoadMore}Load More{:else}No more posts!{/if}</Button
		>
	</div>
</div>

<style lang="scss">
	.page-title {
		@apply font-heading font-bold text-6xl;
	}

	.empty-state {
		@apply mt-12;
	}
</style>
