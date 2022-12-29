import { redirect } from '@sveltejs/kit';

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI;

/** @type {import('./$types').RequestHandler} */
export async function GET({url, cookies}) {
  const getCode = url.searchParams.get('code');
  const dataObject = {
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: DISCORD_REDIRECT_URI,
    code: getCode,
    scope: 'identify email guilds'
  };

  const request = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams(dataObject),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const response = await request.json();

  if (response.error) {
    throw new redirect(303, '/');
  }

  const accessToken_expiresIn = new Date(Date.now() + response.expires_in);
  const refreshToken_expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  cookies.set('access_token', response.access_token, {
    path: '/',
    expires: accessToken_expiresIn,
    httpOnly: true,
    sameSite: 'lax',
  });
  cookies.set('refresh_token', response.refresh_token, {
    path: '/',
    expires: refreshToken_expiresIn,
    httpOnly: true,
    sameSite: 'lax',
  });
  throw new redirect(303, '/');
}
