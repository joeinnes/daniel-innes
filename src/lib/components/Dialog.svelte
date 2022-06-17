<script lang="ts">
	import { spring } from 'svelte/motion';

	export let onClose = () => {};
	export let onCancel = onClose;
	export let colour: string = 'emerald';
	interface coloursObj {
		[key: string]: string;
	}
	const colours: coloursObj = {
		emerald: 'bg-emerald-100 shadow-emerald-500/20',
		amber: 'bg-amber-100 shadow-amber-500/20',
		sky: 'bg-sky-100 shadow-sky-500/20',
		fuchsia: 'bg-fuchsia-100 shadow-fuchsia-500/20',
		rose: 'bg-rose-100 shadow-rose-500/20'
	};

	const dialogSize = spring(0);
	const dialogOpacity = spring(0);

	let modal: HTMLDialogElement | null = null;

	const closeModal = () => {
		onClose();
	};
</script>

<div class="styleable-backdrop" style="opacity:{Math.min($dialogOpacity, 0.8)}" />
<dialog
	bind:this={modal}
	on:click={closeModal}
	style="transform: scale({$dialogSize}); opacity:{$dialogOpacity}"
>
	<article class="rounded" on:click|stopPropagation>
		<header class={colours[colour]}>
			<div class="container">
				<slot name="heading" />
				<a
					href="#close"
					aria-label="Close"
					class="
                          close-button
                        "
					on:click={closeModal}>&times;</a
				>
			</div>
		</header>

		<section class="content">
			<slot name="content" />
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

<style lang="scss">
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
