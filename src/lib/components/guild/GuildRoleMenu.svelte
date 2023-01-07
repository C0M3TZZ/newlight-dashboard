<script>
	import { page } from '$app/stores';
	import { Card, Button, Modal, Input, Label, ButtonGroup, Select, Dropdown, DropdownItem } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import autoAnimate from '@formkit/auto-animate';
	import EmojiPicker from '../EmojiPicker.svelte';

	export let data;

	let createRoleModal = false;
	let sendRoleModal = false;
	let deleteRoleModal = false;
	let editRoleModal = false;

	let roleMenu = data.roleMenu;
	let guildRoles = data.guild.roles.filter((role) => role.name !== '@everyone' && !role.managed);
	guildRoles = guildRoles.map(role => {return { name: role.name, value: role.id }});
	let selectRoleMenu = 0;
	let createRoleMenuInput = '';
	let guildChannels = data.channels.filter((channel) => channel.type === 0);
	guildChannels = guildChannels.map(channel => {return { name: channel.name, value: channel.id }});

	const createRoleMenu = () => {
		roleMenu.push({
			name: createRoleMenuInput,
			roles: [
				{
					name: '',
					desc: '',
					emoji: '🎉',
					roleId: null
				}
			]
		});
		roleMenu = roleMenu;
		createRoleMenuInput = '';
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
			name: '',
			desc: '',
			emoji: '🎉',
			roleId: null
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

	const emojiSelect = (events, index) => {
		roleMenu[selectRoleMenu].roles[index].emoji = events.detail.emoji;
	};
</script>

<Card size="lg">
	<div class="flex flex-col gap-4">
		<div class="flex justify-between">
			<h1 class="text-lg inline-flex items-center text-bold">Role Menu</h1>
			<Button
				class="text-xl"
				on:click={() => {
					createRoleModal = true;
				}}><Icon icon="material-symbols:add-rounded" /></Button
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

<Modal title="Create Role Menu" size="xs" bind:open={createRoleModal} autoclose>
	<div class="flex gap-4 flex-col">
		<Label class="space-y-2 text-start">
			<span> Name </span>
			<Input bind:value={createRoleMenuInput} placeholder="Role Menu 01" />
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
	<Label class="flex flex-col gap-4 text-start">
		<span> Channel </span>
		<Select items={guildChannels} />
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
						<Input placeholder="Description" bind:value={role.desc} />
						<Select items={guildRoles} placeholder="Choose role." />
					</div>
					<div class="flex justify-between">
						<Button color="alternative" class="text-xl">{role.emoji}</Button>
						<Dropdown class="w-full">
							<EmojiPicker on:emojiSelect={(event) => {emojiSelect(event, index)}}></EmojiPicker>
						</Dropdown>
						<ButtonGroup>
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
				class="w-full text-xl"
				on:click={() => {
					addRole();
				}}><Icon icon="material-symbols:add-rounded" /></Button
			>
			<Button class="w-full" color="green"
				><Icon icon="material-symbols:save" class="text-xl" /></Button
			>
		</ButtonGroup>
	</svelte:fragment>
</Modal>
