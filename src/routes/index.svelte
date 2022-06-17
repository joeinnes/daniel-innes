<script lang="ts">
	import Post from '$lib/components/Post.svelte';

	import type { User } from '@prisma/client';

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
</style>
