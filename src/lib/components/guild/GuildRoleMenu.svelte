<script>
	import {
		Card,
		Button,
		Modal,
		Input,
		Label,
		ButtonGroup,
		Select,
		Dropdown,
		Helper,
		Spinner,
	} from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import autoAnimate from '@formkit/auto-animate';
	import EmojiPicker from '../EmojiPicker.svelte';
	import { addToast } from '$lib/toastManager';

	export let data;
	let createRoleLoading = false;
	let createRoleModal = false;
	let sendRoleModal = false;
	let deleteRoleLoading = false;
	let deleteRoleModal = false;
	let editRoleModal = false;
	let saveRoleLoading = false;

	let roleMenu = data.roleMenu;
	let guildRoles = data.guild.roles.filter((role) => role.name !== '@everyone' && !role.managed);
	guildRoles = guildRoles.map((role) => {
		return { name: role.name, value: role.id };
	});
	let selectRoleMenu = 0;
	let createRoleMenuInput = '';
	let sendChannelValue = '';
	let sendChannelText = '';
	let guildChannels = data.channels.filter((channel) => channel.type === 0);
	guildChannels = guildChannels.map((channel) => {
		return { name: channel.name, value: channel.id };
	});

	let sendChannelValid = '';
	let roleMenuEmpty = '';
	let createRoleMenuValid = '';

	let MAX_ROLE = [];
	for (let index = 0; index < Array(25).length; index++) {
		MAX_ROLE.push({
			name: index + 1,
			value: index + 1
		});
	}

	const validatorRequire = (value) => {
		if (value.length < 1) {
			return false;
		}
		return true;
	};

	const sendChannel = async () => {
		sendChannelValid = validatorRequire(sendChannelValue);
		if (!sendChannelValid) {
			return;
		}
		roleMenuEmpty = validatorRequire(roleMenu[selectRoleMenu].roles);
		if (!roleMenuEmpty) {
			return;
		}
		console.log(sendChannelText)
		await fetch(`/api/guild/${roleMenu[selectRoleMenu].id}/rolemenu/${sendChannelValue}/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: sendChannelText
			})
		});
		
		sendRoleModal = false;
		sendChannelValue = '';
		sendChannelText = '';
	};

	const createRoleMenu = async () => {
		createRoleMenuValid = validatorRequire(createRoleMenuInput);
		if (!createRoleMenuValid || createRoleLoading) {
			return;
		}
		createRoleLoading = true;
		const req = await fetch(`/api/guild/${data.guild.id}/rolemenu`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: createRoleMenuInput,
				max: 1,
			})
		});
		createRoleLoading = false;
		if (!req.ok) {
			return;
		}
		const res = await req.json();
		roleMenu = res;
		createRoleMenuInput = '';
		addToast('Role menu created');
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

	const deleteRoleMenu = async () => {
		if (deleteRoleLoading) {
			return;
		}
		deleteRoleLoading = true;
		const req = await fetch(`/api/guild/${data.guild.id}/rolemenu/${roleMenu[selectRoleMenu].id}`, {
			method: 'DELETE'
		});
		if (!req.ok) {
			return;
		}
		deleteRoleLoading = false;
		const res = await req.json();
		roleMenu = res;
		deleteRoleModal = false;
	};

	const addRole = () => {
		roleMenu[selectRoleMenu].roles.push({
			name: '',
			desc: '',
			emoji: '🎉',
			roleId: '',
			validate: ''
		});
		roleMenu = roleMenu;
	};

	const saveRole = async () => {
		roleMenu[selectRoleMenu].roles.forEach((role) => {
			role.validate =
				validatorRequire(role.name) && validatorRequire(role.desc) && validatorRequire(role.roleId);
		});
		roleMenu = roleMenu;
		if (!roleMenu[selectRoleMenu].roles.every((role) => role.validate)) {
			return;
		}
		saveRoleLoading = true;
		const req = await fetch(`/api/guild/${data.guild.id}/rolemenu/${roleMenu[selectRoleMenu].id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				roles: roleMenu[selectRoleMenu].roles,
				max: roleMenu[selectRoleMenu].max
			})
		});
		saveRoleLoading = false;

		const res = await req.json();
		roleMenu = res;
		editRoleModal = false;
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

<Modal title="Create Role Menu" size="xs" bind:open={createRoleModal}>
	<div class="flex gap-4 flex-col">
		<Label class="space-y-2 text-start">
			<span> Name </span>
			<Input
				bind:value={createRoleMenuInput}
				on:input={() => {
					createRoleMenuValid = validatorRequire(createRoleMenuInput);
				}}
				placeholder="Role Menu 01"
			/>
			{#if createRoleMenuValid === false}
				<Helper color="red">Name is require.</Helper>
			{/if}
		</Label>
		<Button
			on:click={() => {
				createRoleMenu();
			}}
			class="w-full"
		>
			{#if createRoleLoading}
				<Spinner size={4} color="gray" />
			{:else}
				Create
			{/if}
		</Button>
	</div>
</Modal>

<Modal bind:open={sendRoleModal} size="xs" title="Select channel to send Role Menu">
	<Label class="flex flex-col space-y-2 text-start">
		<span> Channel </span>
		<Select bind:value={sendChannelValue} items={guildChannels} />
		{#if sendChannelValid === false}
			<Helper color="red">Please Select Text Channel To Send.</Helper>
		{/if}
		{#if roleMenuEmpty === false}
			<Helper color="red">Rolemenu is empty.</Helper>
		{/if}
	</Label>
	<Label class="flex flex-col space-y-2 text-start">
		<span> Message </span>
		<Input placeholder="Please Select Role (Optional)." bind:value={sendChannelText}/>
	</Label>
	<Button
		class="w-full"
		on:click={() => {
			sendChannel();
		}}>Send</Button
	>
</Modal>

<Modal bind:open={deleteRoleModal} title={`Delete ${roleMenu[selectRoleMenu]?.name}?`} size="xs">
	<div class="flex gap-4">
		<Button
			on:click={() => {
				deleteRoleModal = false;
			}}
			color="alternative"
			class="w-full">Cancel</Button
		>
		<Button
			on:click={() => {
				deleteRoleMenu();
			}}
			color="red"
			class="w-full"
		>
			{#if deleteRoleLoading}
				<Spinner size={4} color="gray" />
			{:else}
				Delete
			{/if}
		</Button>
	</div>
</Modal>

<Modal bind:open={editRoleModal} title={`Edit ${roleMenu[selectRoleMenu]?.name}`}>
	<div use:autoAnimate class="flex flex-col gap-4">
		{#if roleMenu[selectRoleMenu].roles.length == 0}
			<p>Please add role.</p>
		{/if}
		{#each roleMenu[selectRoleMenu].roles as role, index}
			<Card size="lg" class="w-full">
				<div class="flex gap-4 flex-col">
					<div class="flex flex-col gap-4">
						<Input placeholder="Name" bind:value={role.name} />
						<Input placeholder="Description" bind:value={role.desc} />
						<Select items={guildRoles} bind:value={role.roleId} placeholder="Choose role." />
					</div>
					<div class="flex justify-between">
						<Button color="alternative" class="text-xl">{role.emoji}</Button>
						<Dropdown class="w-full">
							<EmojiPicker
								on:emojiSelect={(event) => {
									emojiSelect(event, index);
								}}
							/>
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
					{#if role.validate === false}
						<div class="flex justify-start">
							<Helper color="red">This Role is not compele.</Helper>
						</div>
					{/if}
				</div>
			</Card>
		{/each}
	</div>
	<svelte:fragment slot="footer">
		<div class="flex gap-4 w-full flex-col">
			<div class="w-full">
				<Label class="space-y-2 flex flex-col text-start">
					<span>Max Role</span>
					<Select bind:value={roleMenu[selectRoleMenu].max} items={MAX_ROLE}></Select>
				</Label>
			</div>
			<ButtonGroup class="w-full">
				<Button
					class="w-full text-xl"
					on:click={() => {
						addRole();
					}}><Icon icon="material-symbols:add-rounded" /></Button
				>
				<Button
					class="w-full"
					color="green"
					on:click={() => {
						saveRole();
					}}
				>
					{#if saveRoleLoading}
						<Spinner size={4} color="gray" />
					{:else}
						<Icon icon="material-symbols:save" class="text-xl" />
					{/if}
				</Button>
			</ButtonGroup>
		</div>
	</svelte:fragment>
</Modal>
