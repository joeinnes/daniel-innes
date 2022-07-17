<script lang="ts">
	enum Type {
		Text = 'text',
		Photo = 'photo',
		Video = 'video',
		Audio = 'audio',
		Quote = 'quote',
		None = 'none'
	}

	import { invalidate } from '$app/navigation';
	import { spring } from 'svelte/motion';
	import Button from '../components/Button.svelte';
	import PreviewImage from './PreviewImage.svelte';
	import { currentPost, resetCurrentPost } from '$lib/stores/currentPost';

	let modal: HTMLDialogElement | null = null;
	let loading = false;
	let submitting = false;
	let editStart = new Date();
	let edit = false;
	let postDateAsString = $currentPost?.post_date?.toString() || new Date().toString();

	const dialogSize = spring(0);
	const dialogOpacity = spring(0);
	const backgrounds: {
		[key: string]: string;
	} = {
		text: 'bg-emerald-100 shadow-emerald-500/20',
		photo: 'bg-amber-100 shadow-amber-500/20',
		video: 'bg-sky-100 shadow-sky-500/20',
		audio: 'bg-fuchsia-100 shadow-fuchsia-500/20',
		quote: 'bg-rose-100 shadow-rose-500/20'
	};

	const uploadFiles = async (e: Event) => {
		loading = true;
		const target = e.target as HTMLInputElement;
		const fileForm = target.form;
		if (!fileForm) {
			throw new Error('No form found');
		}
		const form = new FormData(fileForm);
		const res = await fetch('/api/upload', { method: 'POST', body: form });
		const resJson = await res.json();

		if (Array.isArray(resJson) && Array.isArray($currentPost.files)) {
			$currentPost.files = [...$currentPost.files, ...resJson];
		} else if (Array.isArray($currentPost.files)) {
			$currentPost.files = [...$currentPost.files, resJson];
		} else {
			throw new Error(
				'Something odd happened when trying to see files attached to the current post'
			);
		}
		loading = false;
	};

	const submitForm = async () => {
		submitting = true;
		$currentPost.post_date = postDateAsString + 'Z';
		try {
			const res = await fetch('/', {
				method: edit ? 'PATCH' : 'POST',
				body: JSON.stringify($currentPost)
			});
			await invalidate('/');
			resetCurrentPost();
		} catch (e) {
			console.error(e);
		} finally {
			submitting = false;
		}
	};

	const openModal = () => {
		if (modal) {
			window.requestAnimationFrame(() => {
				modal?.showModal();
				dialogOpacity.set(1);
				dialogSize.set(1);
			});
		}
	};

	const closeModal = () => {
		if (modal) {
			window.requestAnimationFrame(async () => {
				await Promise.any([dialogSize.set(0), dialogOpacity.set(0)]);
				modal?.close();
			});
		}
	};
	$: {
		if ($currentPost.type !== Type.None && !modal?.open) {
			openModal();
		} else if ($currentPost.type === Type.None && modal?.open) {
			closeModal();
		}
	}
	$: shouldDisable = submitting || loading;
	$: {
		if ($currentPost.id !== undefined && $currentPost?.id > 0) {
			edit = true;
		} else {
			edit = false;
		}
	}
</script>

<div class="styleable-backdrop" style="opacity:{Math.min($dialogOpacity, 0.8)}" />
<dialog
	bind:this={modal}
	on:click={resetCurrentPost}
	style="transform: scale({$dialogSize}); opacity:{$dialogOpacity}"
>
	<article class="rounded" on:click|stopPropagation>
		<header class={$currentPost.type && backgrounds[$currentPost.type]}>
			<div class="container">
				<h2 class="capitalize">
					{edit ? 'Edit' : 'New'}
					{$currentPost.type} Post
				</h2>
				<a
					href="#close"
					aria-label="Close"
					class="
                          close-button
                        "
					on:click={resetCurrentPost}>&times;</a
				>
			</div>
		</header>

		<section class="content">
			<input bind:value={$currentPost.title} placeholder="Title (optional)" />

			<textarea bind:value={$currentPost.text} placeholder="Text (optional)" rows="5" />

			{#if $currentPost.type !== 'text' && $currentPost.type !== 'quote'}
				<div class="dropzone">
					<form on:change={(e) => uploadFiles(e)}>
						<input
							type="file"
							name="file"
							multiple
							accept={$currentPost.type === 'photo' ? 'image/*' : '*/*'}
							class="file-input"
							disabled={loading}
						/>
					</form>

					{#if $currentPost?.files?.length || loading}
						<div class="preview-grid">
							{#if $currentPost?.files?.length}
								{#each $currentPost.files as file}
									<PreviewImage id={file} />
								{/each}
							{/if}

							{#if loading}
								<PreviewImage />
							{/if}

							<div class="new-image">
								<span>+</span>
							</div>
						</div>
					{:else}
						<div class="empty-state">
							<p>Drag your files here or click in this area.</p>
							<Button colour="gray">Select a file</Button>
						</div>
					{/if}
				</div>
			{/if}

			<div class="meta">
				<label for="post_date">
					Post Date
					<input type="datetime-local" bind:value={postDateAsString} name="post_date" />
				</label>
				<label for="visibility"
					>Visibility
					<select name="visibility" id="visibility" bind:value={$currentPost.visibility}>
						<option value="friends" selected>Friends</option>
						<option value="family">Family</option>
						<option value="public">Public</option>
					</select>
				</label>
			</div>
		</section>

		<footer>
			<div class="container">
				<Button type="reset" clickHandler={resetCurrentPost} colour="gray" fullWidth={true}
					>Reset</Button
				>

				<Button
					type="submit"
					colour="emerald"
					clickHandler={submitForm}
					fullWidth={true}
					disabled={shouldDisable}
				>
					Submit
				</Button>
			</div>
		</footer>
	</article>
</dialog>

<style lang="scss">
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

		.content {
			@apply p-4;

			input,
			textarea,
			select {
				@apply block w-full my-4 p-2 border-b-2 border-transparent focus:border-emerald-200 focus:outline-none;
			}

			.dropzone {
				@apply block w-full py-2 px-3 my-4 relative appearance-none border-4 border-emerald-200 border-dashed rounded bg-gray-50 hover:border-emerald-500 transition-colors duration-200;
				.file-input {
					@apply absolute inset-0 z-10 m-0 p-0 w-full outline-none opacity-0;
				}
				.preview-grid {
					@apply grid gap-2 grid-cols-3;
				}

				.new-image {
					@apply flex flex-row items-center justify-center gap-2 aspect-square w-full bg-gray-700;
					span {
						@apply text-6xl text-gray-50;
					}
				}

				.empty-state {
					@apply flex flex-col gap-2 items-center justify-center;
				}
			}

			.meta {
				@apply flex items-center;

				label {
					@apply w-full font-bold;

					input,
					select {
						@apply mt-1 rounded;
					}
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
</style>
