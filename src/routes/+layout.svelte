<script>
	import '../app.postcss';
	import NavBar from '$lib/components/NavBar.svelte';
	import Toast from '$lib/components/Toast.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Toast />
<NavBar bind:data />
<slot />
