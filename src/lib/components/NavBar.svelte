<script>
  	import {
		Navbar,
		NavBrand,
		NavUl,
		Button,
		Avatar,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DarkMode,
	} from 'flowbite-svelte';

    export let data;
		const user = data.user;
</script>

<Navbar let:hidden>
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
	</div>
	{#if user}
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block truncate text-sm font-medium">
					{user.username}#{user.discriminator}
				</span>
			</DropdownHeader>
			<DropdownItem href="/api/auth/signout">Sign out<span></span></DropdownItem>
		</Dropdown>
	{/if}
	<NavUl {hidden} class="order-1">
	</NavUl>
</Navbar>
