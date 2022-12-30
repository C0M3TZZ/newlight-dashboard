<script>
	import { goto } from '$app/navigation';
  import { page } from '$app/stores';
	import { onMount } from 'svelte';
	const user = $page.data.user;

	onMount(() => {
		if (user) {
			goto('/guild');
		}
	});
</script>

<center>
	<h1 class="text-2xl">Login to see something. 🥹✨</h1>
</center>

