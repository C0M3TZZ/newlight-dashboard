const HOST = import.meta.env.VITE_HOST;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, params }) {
	const guildId = params.id;
	let permissions = [];
	let roleMenu = [];
	const req_permissions = await fetch(`${HOST}/api/guild/${guildId}`);
	const req_rolemenu = await fetch(`${HOST}/api/guild/${guildId}/rolemenu`);
	if (req_permissions.status === 200) {
		const json = await req_permissions.json();
		permissions = json.permissions;
	}

	if (req_rolemenu.status === 200) {
		const json = await req_rolemenu.json();
		roleMenu = await json;
	}
  
	return {
		permissions: await permissions,
		roleMenu: await roleMenu
	};
}
