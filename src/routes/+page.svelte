<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const user = $page.data.user;
	console.log(user);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if user}
	<img
		alt="{user.userName}#{user.discriminator} avatar"
		src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
	/>
	<h2>Hello {user.username}#{user.discriminator}</h2>
	<button
		on:click={() => {
			goto('/api/signout');
		}}>Sign Out</button
	>
{:else}
	<button
		on:click={() => {
			goto('/api/auth');
		}}>Sign In With Discord</button
	>
{/if}
