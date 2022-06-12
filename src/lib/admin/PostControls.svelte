<script lang="ts">
	import { browser } from '$app/env';
	import { spring } from 'svelte/motion';
	import ActionButton from './ActionButton.svelte';
	import Button from '../components/Button.svelte';
	import PreviewImage from './PreviewImage.svelte';
	import Text from '../icons/Text.svelte';
	import Photo from '../icons/Photo.svelte';
	import Video from '../icons/Video.svelte';
	import Audio from '../icons/Audio.svelte';
	import Quote from '../icons/Quote.svelte';
	import posts from '../stores/posts';

	import type { Post } from '@prisma/client';

	const dialogSize = spring(0);
	const dialogOpacity = spring(0);

	interface SerialisablePost extends Omit<Post, 'post_date'> {
		post_date: string;
		files: string[];
	}
	let editStart = new Date();
	editStart.setMinutes(editStart.getMinutes() - editStart.getTimezoneOffset());
	enum Type {
		Text = 'text',
		Photo = 'photo',
		Video = 'video',
		Audio = 'audio',
		Quote = 'quote',
		None = 'none'
	}

	let modal: HTMLDialogElement | null = null;
	let post: Partial<SerialisablePost> = {
		type: 'none',
		title: '',
		text: '',
		post_date: editStart.toISOString().slice(0, -8),
		visibility: 'friends',
		files: []
	};
	let loading = false;
	let submitting = false;
	let shouldDisable = false;

	const setPostType = (newType: Type) => {
		resetPost();
		post.type = newType;
	};

	const resetPost = () => {
		editStart = new Date();
		editStart.setMinutes(editStart.getMinutes() - editStart.getTimezoneOffset());

		post = {
			type: 'none',
			title: '',
			text: '',
			post_date: editStart.toISOString().slice(0, -8),
			visibility: 'friends',
			files: []
		};
		loading = false;
	};

	const backgrounds = {
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

		if (Array.isArray(resJson)) {
			post.files = [...post.files, ...resJson];
		} else {
			post.files = [...post.files, resJson];
		}
		loading = false;
		console.log(post.files);
	};

	const submitForm = async () => {
		submitting = true;
		post.post_date = new Date(post.post_date + ' UTC');
		// post.files = post.files.map((el) => ({ directus_files_id: el.id }));
		try {
			const res = await fetch('/', { method: 'POST', body: JSON.stringify(post) });
			if (Array.isArray(res)) {
				$posts = [...$posts, ...res];
				resetPost();
			} else {
				$posts = [...$posts, res];
				resetPost();
			}
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

	$: post.type !== 'none' ? openModal() : closeModal();
	$: shouldDisable = submitting || loading;
</script>

<section>
	<div>
		<div class="button-panel">
			<ActionButton Icon={Text} clickHandler={() => setPostType(Type.Text)} colour="emerald" />
			<ActionButton Icon={Photo} clickHandler={() => setPostType(Type.Photo)} colour="amber" />
			<ActionButton Icon={Video} clickHandler={() => setPostType(Type.Video)} colour="sky" />
			<ActionButton Icon={Audio} clickHandler={() => setPostType(Type.Audio)} colour="fuchsia" />
			<ActionButton Icon={Quote} clickHandler={() => setPostType(Type.Quote)} colour="rose" />
		</div>
		<div class="styleable-backdrop" style="opacity:{Math.min($dialogOpacity, 0.8)}" />
		<dialog
			bind:this={modal}
			on:click={resetPost}
			style="transform: scale({$dialogSize}); opacity:{$dialogOpacity}"
		>
			<article class="rounded" on:click|stopPropagation>
				<header class={backgrounds[post.type]}>
					<div class="container">
						<h2>
							New {post.type} post
						</h2>
						<a
							href="#close"
							aria-label="Close"
							class="
                          close-button
                        "
							on:click={resetPost}>&times;</a
						>
					</div>
				</header>

				<section class="content">
					<input bind:value={post.title} placeholder="Title (optional)" />

					<textarea bind:value={post.text} placeholder="Text (optional)" rows="5" />

					{#if post.type !== 'text' && post.type !== 'quote'}
						<div class="dropzone">
							<form on:change={(e) => uploadFiles(e)}>
								<input
									type="file"
									name="file"
									multiple
									accept={post.type === 'photo' ? 'image/*' : '*/*'}
									class="file-input"
									disabled={loading}
								/>
							</form>

							{#if post?.files?.length || loading}
								<div class="preview-grid">
									{#each post.files as file}
										<PreviewImage id={file} />
									{/each}

									{#if loading}
										<PreviewImage {loading} />
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
							<input type="datetime-local" bind:value={post.post_date} name="post_date" />
						</label>
						<label for="visibility"
							>Visibility
							<select name="visibility" id="visibility" bind:value={post.visibility}>
								<option value="friends" selected>Friends</option>
								<option value="family">Family</option>
								<option value="public">Public</option>
							</select>
						</label>
					</div>
				</section>

				<footer>
					<div class="container">
						<Button
							type="reset"
							clickHandler={modal?.close() && resetPost()}
							colour="gray"
							fullWidth={true}>Reset</Button
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
	</div>
</section>

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
		@apply fixed top-0 left-0 right-0 bottom-0 bg-gray-900 pointer-events-none;
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
					@apply absolute inset-0 z-50 m-0 p-0 w-full outline-none opacity-0;
				}
				.preview-grid {
					@apply grid gap-2 grid-cols-3;
				}

				.new-image {
					@apply flex flex-row items-center justify-center space-x-2 aspect-square w-full bg-gray-700;
					span {
						@apply text-6xl text-gray-50;
					}
				}

				.empty-state {
					@apply flex flex-col space-y-2 items-center justify-center;
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
