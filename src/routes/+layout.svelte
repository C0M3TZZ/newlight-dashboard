<script>
	import '../app.postcss';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Button,
		Avatar,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
		DarkMode,
		Chevron,
		Search
	} from 'flowbite-svelte';
	import { page } from '$app/stores';
	const user = $page.data.user;
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<h1 class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Project 
			<span class="dark:text-yellow-200 text-yellow-400">
				NewLight✨
			</span>
		</h1>
	</NavBrand>
	<div class="flex md:order-2">
		<div class="flex gap-5">
			{#if user}
				<Avatar
					id="avatar-menu"
					alt="{user.username}#{user.discriminator}"
					src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
				/>
			{:else}
				<Button href="/api/auth" size="sm">Login</Button>
			{/if}
			<DarkMode />
		</div>
		<!-- <NavHamburger on:click={toggle} /> -->
	</div>
	{#if user}
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block truncate text-sm font-medium">
					{user.username}#{user.discriminator}
				</span>
			</DropdownHeader>
			<!-- <DropdownDivider /> -->
			<DropdownItem href="/api/auth/signout">Sign out<span></span></DropdownItem>
		</Dropdown>
	{/if}
	<NavUl {hidden} class="order-1">
		<!-- <Button><Chevron>Dropdown button</Chevron></Button>
		<Dropdown class="overflow-y-auto h-48">
			<div slot="header" class="p-3">
				<Search size="md"/>
			</div>
			<DropdownItem class="flex items-center text-base font-semibold gap-2">
				<Avatar src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png" size="xs"/>TEST
			</DropdownItem>
		</Dropdown> -->
	</NavUl>
</Navbar>
<slot />
