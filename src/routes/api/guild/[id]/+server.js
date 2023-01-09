import { PrismaClient } from '@prisma/client';
import { isOwner } from '$lib/server/discord';
import { error } from '@sveltejs/kit';
const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, params }) {
	const guildId = params.id;
	const guild = await prisma.guild.findUnique({
		where: { guildId: guildId },
		select: { permissions: true }
	});
	if (!guild) {
		throw new error(404, 'Guild not found');
	}
	return new Response(JSON.stringify(guild),{
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, params }) {
	const guildId = params.id;
	if (!(await isOwner(guildId, cookies.get('access_token')))) {
		throw new error(403, 'You are not the owner of this guild');
	}
	let { permissions } = await request.json();
	const guild = await prisma.guild.findUnique({ where: { guildId: guildId } });

	if (!guild) {
		console.log('guild not found, creating new one');
		await prisma.guild.create({
			data: {
				guildId: guildId,
				permissions: permissions
			}
		});
	} else {
		console.log('guild found, updating');
		await prisma.guild.update({
			where: {
				guildId: guildId
			},
			data: {
				permissions: permissions
			}
		});
	}
	return new Response(
		JSON.stringify(
			await prisma.guild.findUnique({
				where: { guildId: guildId },
				select: {
					permissions: true
				}
			})
		),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
