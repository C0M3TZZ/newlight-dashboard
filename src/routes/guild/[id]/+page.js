const HOST = import.meta.env.VITE_HOST;

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const req_guild = await fetch(`${HOST}/api/discord/guild/${params.id}`);
	const getGuild = await req_guild.json();
	const req_channels = await fetch(`${HOST}/api/discord/guild/${params.id}/channels`);
	const guildId = params.id;
	let channels = [];
	if (req_channels.status === 200) {
		channels = await req_channels.json();
	}

	if (req_guild.status !== 404) {
		return {
			guild: await getGuild,
			channels: channels,
			guildId
		};
	} else {
		return {
			guild: null,
			channels: channels,
			guildId
		};
	}
}
