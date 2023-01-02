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

	let defaultRole = {
		name: '',
		desc: '',
		emoji: '',
		roleId: null
	};

	const createRoleMenu = () => {
		roleMenu.push({
			name: form.crateForm.name,
			roles: [defaultRole]
		});
		roleMenu = roleMenu;
		form.crateForm.name = '';
		createRoleModal = false;
	};

	const editRoleMenu = (index) => {
		selectRoleMenu = index;
		editRoleModal = true;
	};

	const deleteRoleMenuModal = (index) => {
		selectRoleMenu = index;
		deleteRoleModal = true;
	};

	const deleteRoleMenu = () => {
		roleMenu.splice(selectRoleMenu, 1);
		roleMenu = roleMenu;
		deleteRoleModal = false;
	};

	const addRole = () => {
		roleMenu[selectRoleMenu].roles.push({
			defaultRole
		});
		roleMenu = roleMenu;
	};

	const swapRole = (index, destination) => {
		if (index + destination < 0 || index + destination >= roleMenu[selectRoleMenu].roles.length) {
			return;
		}
		const temp = roleMenu[selectRoleMenu].roles[index];
		roleMenu[selectRoleMenu].roles[index] = roleMenu[selectRoleMenu].roles[index + destination];
		roleMenu[selectRoleMenu].roles[index + destination] = temp;
		roleMenu = roleMenu;
	};

	const deleteRole = (index) => {
		roleMenu[selectRoleMenu].roles.splice(index, 1);
		roleMenu = roleMenu;
	};

	let form = {
		crateForm: {
			name: ''
		}
	};
	let roleMenu = [];
	let selectRoleMenu = 0;
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
					<div class="p-2 gap-4 flex flex-col" use:autoAnimate>
						{#if roleMenu.length == 0}
							<div class="flex justify-center">
								<h1 class="text-lg text-bold">You don't have any Role Menu.</h1>
							</div>
						{/if}
						{#each roleMenu as role, index}
							<Card size="lg" class="w-full">
								<div class="flex justify-between">
									<h1 class="text-xl inline-flex items-center">{role.name}</h1>
									<ButtonGroup>
										<Button
											on:click={() => {
												sendRoleModal = true;
											}}><Icon icon="ri:send-plane-fill" class="text-xl" /></Button
										>
										<Button
											on:click={() => {
												editRoleMenu(index);
												// editRoleModal = true;
											}}><Icon icon="ri:settings-4-fill" class="text-xl" /></Button
										>
										<Button
											color="red"
											on:click={() => {
												deleteRoleMenuModal(index);
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
			<Input bind:value={form.crateForm.name} placeholder="Role Menu 01" />
		</Label>
		<Button
			on:click={() => {
				createRoleMenu();
			}}
			class="w-full">Create</Button
		>
	</div>
</Modal>

<Modal bind:open={sendRoleModal} size="xs" title="Select channel to send Role Menu" autoclose>
	<Label class="flex flex-col gap-4">
		<span> Channel </span>
		<Select />
		<Button>Send</Button>
	</Label>
</Modal>

<Modal bind:open={deleteRoleModal} title="Delete NAME?" size="xs">
	<div class="flex gap-4">
		<Button color="alternative" class="w-full">Cancel</Button>
		<Button
			on:click={() => {
				deleteRoleMenu();
			}}
			color="red"
			class="w-full">Delete</Button
		>
	</div>
</Modal>

<Modal bind:open={editRoleModal} title="Edit Name">
	<div use:autoAnimate class="flex flex-col gap-4">
		{#each roleMenu[selectRoleMenu].roles as role, index}
			<Card size="lg" class="w-full">
				<div class="flex gap-4 flex-col">
					<div class="flex flex-col gap-4">
						<Input placeholder="Name" bind:value={role.name} />
						<Input placeholder="Description" bind:value={role.desc}/>
						<Select placeholder="Choose the emoji." />
					</div>
					<div class="flex justify-between">
						<Button color="alternative" class="text-xl">✨</Button>
						<ButtonGroup>
							<!-- <Button color="green"><Icon icon="material-symbols:save" class="text-xl" /></Button> -->
							<Button
								disabled={index === 0}
								on:click={() => {
									swapRole(index, -1);
								}}><Icon icon="material-symbols:arrow-upward-rounded" class="text-xl" /></Button
							>
							<Button
								disabled={index === roleMenu[selectRoleMenu].roles.length - 1}
								on:click={() => {
									swapRole(index, 1);
								}}><Icon icon="material-symbols:arrow-downward-rounded" class="text-xl" /></Button
							>
							<Button
								color="red"
								on:click={() => {
									deleteRole(index);
								}}><Icon icon="material-symbols:close-rounded" class="text-xl" /></Button
							>
						</ButtonGroup>
					</div>
				</div>
			</Card>
		{/each}
	</div>
	<svelte:fragment slot="footer">
		<ButtonGroup class="w-full">
			<Button
				class="w-full"
				on:click={() => {
					addRole();
				}}>+</Button
			>
			<Button class="w-full" color="green"
				><Icon icon="material-symbols:save" class="text-xl" /></Button
			>
		</ButtonGroup>
	</svelte:fragment>
</Modal>
