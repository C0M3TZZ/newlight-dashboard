import { error } from '@sveltejs/kit';

const DISCORD_API_URL = import.meta.env.VITE_DISCORD_API_URL;

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const req_guild = await fetch(`${DISCORD_API_URL}/guilds/${params.id}`, {
		headers: {
			Authorization: `Bot ${import.meta.env.VITE_DISCORD_BOT_TOKEN}`
		}
	});
	const getGuild = await req_guild.json();
	if (getGuild.code === 50001 || getGuild.code === 10004) {
		throw new error(404, "Bot Can't Access Guild");
	} else {
		return new Response(JSON.stringify(getGuild), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
