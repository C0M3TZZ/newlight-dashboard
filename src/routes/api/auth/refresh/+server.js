import { error } from '@sveltejs/kit';

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const refreshToken = url.searchParams.get('code');
	if (!refreshToken) {
		throw new error(400, 'RT Not Found');
	}

	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		refresh_token: refreshToken
	};

	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	const response = await request.json();
	if (request.status != 200) {
		throw	new error(request.status, request.statusText);
	}
	if (response.error) {
		throw new error(500, response.error);
	}
	return new Response(JSON.stringify({ ...response }));
}
