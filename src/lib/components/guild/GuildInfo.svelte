<script>
  import {
		Card,
		Button,
		Chevron,
		Dropdown,
		DropdownItem,
		Checkbox,
	} from 'flowbite-svelte';

  export let data;
  const guild = data.guild;
</script>

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
