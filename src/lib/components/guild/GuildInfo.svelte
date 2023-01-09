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
  let guildRoles = data.guild.roles.filter((role) => role.name !== '@everyone' && !role.managed);
	guildRoles = guildRoles.map(role => {return { name: role.name, value: role.id }});
  let permissions = data.permissions;

  const updateGuild = async () => {
    const res = await fetch(`/api/guild/${guild.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        permissions
      })
    });
    const json = await res.json();
    permissions = json.permissions;
  };
</script>

{#if guild.owner_id == data.user.id}
<Card size="lg">
  <div class="flex flex-col gap-2">
    <div class="flex justify-start">
      <h1 class="text-lg text-bold">Guild Info</h1>
    </div>
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
          {#each guildRoles as role}
            <DropdownItem>
              <Checkbox on:change={
                () => {
                  updateGuild()
                }
              } bind:group={permissions} value={role.value}>{role.name}</Checkbox>
            </DropdownItem>
          {/each}
        </Dropdown>
      </Card>
    </div>
  </Card>
  {/if}
