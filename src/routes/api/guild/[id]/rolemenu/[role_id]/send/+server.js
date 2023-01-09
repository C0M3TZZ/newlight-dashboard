import { error } from '@sveltejs/kit';

const DISCORD_BOT_API = import.meta.env.VITE_DISCORD_BOT_API;

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params }) {
	const sendreq = await fetch(
		`${DISCORD_BOT_API}/send/${params.id}/${params.role_id}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
  if (sendreq.status === 200) {
    return new Response(JSON.stringify(await sendreq.json()), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  throw new error(500, 'Internal Server Error');
}
