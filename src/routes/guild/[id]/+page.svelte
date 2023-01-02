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
		SidebarItem,
		Chevron,
		Dropdown,
		DropdownItem,
		Checkbox,
		Modal,
		Input,
		Label,
		ButtonGroup,
		Select,
		Accordion,
		AccordionItem
	} from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { sineIn } from 'svelte/easing';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import autoAnimate from '@formkit/auto-animate';
	let createRoleModal = false;
	let sendRoleModal = false;
	let serverDrawerHide = true;
	let deleteRoleModal = false;
	let editRoleModal = false;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	let roleMenu = [];
	let roleMenuData = [];
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
		console.log(guild);
		console.log(data.user);
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
			<div class="flex flex-col gap-2">
				<div class="flex justify-start">
					<h1 class="text-lg text-bold">Guild Info</h1>
				</div>
				{#if guild.owner_id == data.user.id}
					<Card size="lg">
						<div class="flex">
							<h1 class="text-start mb-4">
								Role Access <span class="text-gray-500"
									>- Select the roles that can access this bot.</span
								>
							</h1>
						</div>
						<Button><Chevron>Role Access</Chevron></Button>
						<Dropdown>
							{#each guild.roles as role}
								<DropdownItem>
									<Checkbox>{role.name}</Checkbox>
								</DropdownItem>
							{/each}
						</Dropdown>
					</Card>
				{/if}
			</div>
		</Card>
		<Card size="lg">
			<div class="flex flex-col gap-4">
				<div class="flex justify-between">
					<h1 class="text-lg inline-flex items-center text-bold">Role Menu</h1>
					<Button
						on:click={() => {
							createRoleModal = true;
						}}>+</Button
					>
				</div>
				<div class="max-h-48 overflow-y-scroll">
					<div class="p-2" use:autoAnimate>
						{#each roleMenu as role}
							<Card size="lg">
								<div class="flex justify-between">
									<h1 class="text-xl inline-flex items-center">Guild</h1>
									<ButtonGroup>
										<Button
											on:click={() => {
												sendRoleModal = true;
											}}><Icon icon="ri:send-plane-fill" class="text-xl" /></Button
										>
										<Button
											on:click={() => {
												editRoleModal = true;
											}}><Icon icon="ri:settings-4-fill" class="text-xl" /></Button
										>
										<Button
											color="red"
											on:click={() => {
												deleteRoleModal = true;
											}}><Icon icon="ri:close-fill" class="text-xl" /></Button
										>
									</ButtonGroup>
								</div>
							</Card>
						{/each}
					</div>
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
		<Search
			bind:value
			on:input={() => {
				search();
			}}
			size="md"
		/>
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

<Modal title="Create Role Menu" size="xs" bind:open={createRoleModal} autoclose>
	<div class="flex gap-4 flex-col">
		<Label class="space-y-2">
			<span> Name </span>
			<Input placeholder="Role Menu 01" />
		</Label>
		<Button on:click={() => {roleMenu.push("_"); roleMenu = roleMenu;}} class="w-full">Create</Button>
	</div>
</Modal>

<Modal bind:open={sendRoleModal} size="xs" title="Select channel to send Role Menu" autoclose>
	<Label class="flex flex-col gap-4">
		<span> Channel </span>
		<Select />
		<Button>Send</Button>
	</Label>
</Modal>

<Modal bind:open={deleteRoleModal} title="Delete NAME?" size="xs" autoclose>
	<div class="flex gap-4">
		<Button color="alternative" class="w-full">Cancel</Button>
		<Button color="red" class="w-full">Delete</Button>
	</div>
</Modal>

<Modal bind:open={editRoleModal} title="Edit Name">
	<div use:autoAnimate class="flex flex-col gap-4">
		{#each roleMenuData as role}
			<Card size="lg" class="w-full">
				<div class="flex gap-4 flex-col">
					<div class="flex flex-col gap-4">
						<Input />
						<Input />
					</div>
					<div class="flex justify-between">
						<Button class="text-xl">✨</Button>
						<ButtonGroup>
							<Button color="green"><Icon icon="material-symbols:save" class="text-xl" /></Button>
							<Button><Icon icon="material-symbols:arrow-upward-rounded" class="text-xl" /></Button>
							<Button
								><Icon icon="material-symbols:arrow-downward-rounded" class="text-xl" /></Button
							>
							<Button color="red"
								><Icon icon="material-symbols:close-rounded" class="text-xl" /></Button
							>
						</ButtonGroup>
					</div>
				</div>
			</Card>
		{/each}
	</div>
	<svelte:fragment slot="footer">
		<Button
			class="w-full"
			on:click={() => {
				roleMenuData.push('a');
				roleMenuData = roleMenuData;
				console.log('ADD MORE');
			}}>+</Button
		>
	</svelte:fragment>
</Modal>
