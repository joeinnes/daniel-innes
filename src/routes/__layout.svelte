<script>
	import '../app.css';
	import '$lib/styles/twitter.css';
</script>

<svelte:head>
	<title>{import.meta.env.VITE_SITE_NAME}</title>
</svelte:head>
<body>
	<main>
		<slot />
	</main>
</body>

<style>
	body {
		@apply flex flex-col font-serif;
	}

	main {
		@apply max-w-prose mx-auto pt-8 w-3/4 lg:w-full;
	}
</style>
