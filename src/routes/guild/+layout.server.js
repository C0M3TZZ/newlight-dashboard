const DISCORD_API_URL = import.meta.env.VITE_DISCORD_API_URL;

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const access_token = await cookies.get('access_token');
  const req_guilds = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  const getGuilds = await req_guilds.json();

  return {
    guilds: await getGuilds
  }
}
