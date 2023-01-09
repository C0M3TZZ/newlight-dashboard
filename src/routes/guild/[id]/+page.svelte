<script>
	import {
		Card,
	} from 'flowbite-svelte';
	import GuildInfo from '$lib/components/guild/GuildInfo.svelte';
	import GuildSelector from '$lib/components/guild/GuildSelector.svelte';
	import GuildRoleMenu from '$lib/components/guild/GuildRoleMenu.svelte';
	/** @type {import('./$types').PageData} */
	export let data;

</script>

<center class="py-2 space-y-2">
	<GuildSelector bind:data></GuildSelector>
	{#if data.guild}
		<GuildInfo bind:data></GuildInfo>
		<GuildRoleMenu bind:data></GuildRoleMenu>
	{:else}
		<Card size="lg">
			<h1 class="text-lg text-bold">This Bot is not in this server.</h1>
		</Card>
	{/if}
</center>
