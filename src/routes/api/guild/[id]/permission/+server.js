import { error } from '@sveltejs/kit';
import { getMemberGuild, getGuild } from '$lib/server/discord';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
  const guildId = await params.id;
	const member = await getMemberGuild(await cookies.get('access_token'), guildId);
	if (!member) {
		throw new error(404, 'User not found');
	}
	const guild = await prisma.guild.findUnique({
		where: { guildId: params.id }
	});
	const guildData = await getGuild(params.id);
	if (
		member.roles.some((role) => guild?.permissions?.includes(role)) ||
		member.user.id === guildData.owner_id
	) {
		return new Response(
			JSON.stringify({
				hasPermission: true
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} else {
    return new Response(
      JSON.stringify({
        hasPermission: false
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
