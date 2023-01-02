import { error } from '@sveltejs/kit';

const DISCORD_API_URL = import.meta.env.VITE_DISCORD_API_URL;

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  const req_guild = await fetch(`${DISCORD_API_URL}/guilds/${params.id}/channels`, {
		headers: {
			Authorization: `Bot ${import.meta.env.VITE_DISCORD_BOT_TOKEN}`
		}
	});
  // console.log(req_guild);
  if (req_guild.status === 200) {
    const allChannels = await req_guild.json();
    const textChannels = allChannels.filter(channel => channel.type === 0);
    console.log(textChannels);
    return new Response(JSON.stringify(textChannels), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else {
    throw new error(404, "Bot Can't Access Guild");
  }
}
