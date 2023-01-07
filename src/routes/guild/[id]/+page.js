const HOST = import.meta.env.VITE_HOST;

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const req_guild = await fetch(`${HOST}/api/discord/guild/${params.id}`);
	const getGuild = await req_guild.json();
	// const req_channels = await fetch(`${HOST}/api/discord/guild/${params.id}/channels`);

	if (req_guild.status !== 404) {
		return {
			guild: await getGuild,
			roleMenu: []
		};
	} else {
		return {
			guild: null,
			roleMenu: []
		};
	}
}
