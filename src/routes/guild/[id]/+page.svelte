<script>
	import { Card, Spinner } from 'flowbite-svelte';
	import GuildInfo from '$lib/components/guild/GuildInfo.svelte';
	import GuildSelector from '$lib/components/guild/GuildSelector.svelte';
	import GuildRoleMenu from '$lib/components/guild/GuildRoleMenu.svelte';
	import autoAnimate from '@formkit/auto-animate';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<center class="py-2 space-y-2" use:autoAnimate>
	<GuildSelector bind:data />
	{#if data.guild}
		<GuildInfo bind:data />
		{#if data.hasPermission}
		<GuildRoleMenu bind:data />
		{:else if data.hasPermission === false}
			<Card size="lg">
				<h1 class="text-lg text-bold">You do not have permission to access this guild.</h1>
			</Card>
			{:else}
			<Card size="lg">
				<h1 class="text-lg text-bold"><Spinner></Spinner></h1>
			</Card>
		{/if}
	{:else}
		<Card size="lg">
			<h1 class="text-lg text-bold">This Bot is not in this server.</h1>
		</Card>
	{/if}
</center>
