const DISCORD_API_URL = import.meta.env.VITE_DISCORD_API_URL;
const HOST = import.meta.env.VITE_HOST;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	const access_token = await cookies.get('access_token');
	const refresh_token = await cookies.get('refresh_token');

	if (refresh_token && !access_token) {
		const req_refresh = await fetch(`${HOST}/api/refresh?code=${refresh_token}`);
		const getRefresh = await req_refresh.json();
		const accessToken_expiresIn = new Date(Date.now() + getRefresh.expires_in);
		const refreshToken_expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
		cookies.set('access_token', getRefresh.access_token, {
			path: '/',
			expires: accessToken_expiresIn,
			httpOnly: true,
			sameSite: 'Strict'
		});
		cookies.set('refresh_token', getRefresh.refresh_token, {
			path: '/',
			expires: refreshToken_expiresIn,
			httpOnly: true,
			sameSite: 'Strict'
		});

		if (getRefresh.access_token) {
			const req_user = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: {
					Authorization: `Bearer ${getRefresh.access_token}`
				}
			});
			const getUser = await req_user.json();

			return {
				user: await getUser
			};
		}
	}

	if (cookies.get('access_token')) {
		const req_user = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`
			}
		});
		const getUser = await req_user.json();

		return {
			user: await getUser
		};
	}

	return {
		user: null
	};
}
