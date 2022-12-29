import { redirect } from '@sveltejs/kit';
const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
		DISCORD_REDIRECT_URI
	)}&response_type=code&scope=identify%20email%20guilds`;

  throw new redirect(303, DISCORD_ENDPOINT);
}
