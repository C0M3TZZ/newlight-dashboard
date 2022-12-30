const HOST = import.meta.env.VITE_HOST;

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const req_guild = await fetch(`${HOST}/api/discord/guild/${params.id}`);
	const getGuild = await req_guild.json();

	if (req_guild.status !== 404) {
		return {
			guild: await getGuild,
		};
	} else {
		return {
			guild: null,
		};
	}
}
