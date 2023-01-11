const HOST = import.meta.env.VITE_HOST;

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const guildId = params.id;
	const req_guild = await fetch(`${HOST}/api/discord/guild/${params.id}`);
	const req_channels = await fetch(`${HOST}/api/discord/guild/${params.id}/channels`);
	const req_permissions = await fetch(`${HOST}/api/guild/${guildId}`);
	const req_rolemenu = await fetch(`${HOST}/api/guild/${guildId}/rolemenu`);
	const req_hasPermission = await fetch(`${HOST}/api/guild/${guildId}/permission`);
	const getGuild = await req_guild.json();
	let channels = [];
	let permissions = [];
	let roleMenu = [];

	const {hasPermission} = await req_hasPermission.json();

	if (req_channels.status === 200) {
		channels = await req_channels.json();
	}

	if (req_permissions.status === 200) {
		const json = await req_permissions.json();
		permissions = json.permissions;
	}

	if (req_rolemenu.status === 200) {
		const json = await req_rolemenu.json();
		roleMenu = await json;
	}

	if (req_guild.status === 200) {
		return {
			guild: await getGuild,
			channels: channels,
			guildId,
			permissions: await permissions,
			roleMenu: await roleMenu,
			hasPermission: await hasPermission
		};
	} else {
		return {
			guild: null,
			channels: channels,
			guildId,
			permissions: await permissions,
			roleMenu: await roleMenu,
			hasPermission: await hasPermission
		};
	}
}
