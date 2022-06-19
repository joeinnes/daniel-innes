<script lang="ts">
	import ActionButton from './ActionButton.svelte';
	import Text from '../icons/Text.svelte';
	import Photo from '../icons/Photo.svelte';
	import Video from '../icons/Video.svelte';
	import Audio from '../icons/Audio.svelte';
	import Quote from '../icons/Quote.svelte';
	import { currentPost } from '$lib/stores/currentPost';
	import PostEditor from './PostEditor.svelte';

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

	let loading = false;
	let submitting = false;
	let shouldDisable = false;

	const setPostType = (newType: Type) => {
		$currentPost.type = newType;
	};
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
		<PostEditor />
	</div>
</section>

<style lang="scss">
	section {
		@apply font-sans;
	}

	.button-panel {
		@apply flex justify-between my-8 gap-4 items-center;
	}

	.action-button-emerald {
		@apply bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 shadow-lg;
	}
</style>
