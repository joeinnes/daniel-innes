<script lang="ts">
	import Post from '$lib/components/Post.svelte';

	import type { Post as PostType, User } from '@prisma/client';

	import PostControls from '$lib/admin/PostControls.svelte';
	import postsStore from '$lib/stores/posts';

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
		posts = [...$postsStore, ...data.posts];
	};
	$: $postsStore = posts;
</script>

<div>
	<a href="/"><h1 class="page-title">{import.meta.env.VITE_SITE_NAME}</h1></a>
	{#if canPost}
		<PostControls />
	{/if}

	{#each $postsStore as post (post.id)}
		<Post {post} />
	{:else}
		<article class="empty-state">No posts found.</article>
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

	.empty-state {
		@apply mt-12;
	}
</style>
