import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	cookies.set('access_token', null, {
		path: '/',
		httpOnly: true,
		sameSite: 'Strict',
		expires: new Date(0),
	});
	cookies.set('refresh_token', null, {
		path: '/',
		httpOnly: true,
		sameSite: 'Strict',
		expires: new Date(0),
	});
	throw new redirect(303, '/');
}
