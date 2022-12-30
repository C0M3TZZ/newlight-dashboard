<script>
	import {
		Card,
		Avatar,
		Button,
		Drawer,
		CloseButton,
		Search,
		Sidebar,
		SidebarWrapper,
		SidebarGroup,
		SidebarItem
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	let serverDrawerHide = true;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	/** @type {import('./$types').PageData} */
	export let data;
	const guilds = data.guilds;
  let value = '';
  let filterGuilds = guilds;
	let guild = data.guild;

	let seltectedGuild = null;

  const search = () => {
    filterGuilds = guilds.filter((g) => g.name.toLowerCase().includes(value.toLowerCase()));
  };

	const changeGuild = () => {
		serverDrawerHide = true;
	};

	const getAvatar = (guild) => {
		if (guild.icon !== null) {
			return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
		} else {
			const avatar = guild.name
				.split(' ')
				.map((n) => n[0])
				.join('');
			return `https://ui-avatars.com/api/?name=${avatar}&background=7289da&color=ffffff`;
		}
	};

	afterNavigate(() => {
		seltectedGuild = guilds.find((g) => g.id === $page.params.id);
    guild = data.guild;
	});
</script>

<center class="py-2 space-y-2">
	<Card size="lg">
		<div class="flex justify-between gap-4">
			<div class="flex gap-4 items-center overflow-x-scroll">
				{#if seltectedGuild}
					<Avatar src={getAvatar(seltectedGuild)} />
					<h1 class="text-lg text-bold">{seltectedGuild.name}</h1>
				{:else}
					<Avatar />
				{/if}
			</div>
			<div>
				<Button on:click={() => (serverDrawerHide = false)}>Change Server</Button>
			</div>
		</div>
	</Card>
  {#if guild}
    <Card size="lg">
      <div class="flex flex-col">
        <div class="flex justify-start">
          <h1 class="text-lg text-bold">Guild Info</h1>
        </div>
      </div>
    </Card>
  {:else}
    <Card size="lg">
      <h1 class="text-lg text-bold">This Bot is not in this server.</h1>
    </Card>
  {/if}

</center>

<Drawer transitionType="fly" {transitionParams} bind:hidden={serverDrawerHide} id="sidebar1">
	<div class="flex items-center">
		<h5 class="inline-flex items-center mb-4 text-base font-semibold">Select Server</h5>
		<CloseButton on:click={() => (serverDrawerHide = true)} class="mb-4 dark:text-white" />
	</div>
	<div class="flex flex-col gap-2">
		<Search bind:value on:input={() => {search()}} size="md" />
		<Sidebar asideClass="w-full">
			<SidebarWrapper>
				<SidebarGroup>
					{#each filterGuilds as guild}
						<SidebarItem
							href="/guild/{guild.id}"
							on:click={() => {
								changeGuild();
							}}
							label={guild.name}
						>
							<svelte:fragment slot="icon">
								<Avatar src={getAvatar(guild)} />
							</svelte:fragment>
						</SidebarItem>
					{/each}
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</div>
</Drawer>
