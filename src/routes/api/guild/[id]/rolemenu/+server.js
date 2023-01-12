import { getMemberGuild } from '$lib/server/discord';
import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { getGuild } from '$lib/server/discord';
const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, params }) {
	const member = await getMemberGuild(cookies.get('access_token'), params.id);
	let { name } = await request.json();
	const guild = await prisma.guild.findUnique({
		where: { guildId: params.id }
	});
	if (!member) {
		throw new error(404, 'User not found');
	}
	if (!guild) {
		await prisma.guild.create({
			data: {
				guildId: params.id
			}
		});
	}
	const guildData = await getGuild(params.id);
	if (
		!member.roles.some((role) => guild?.permissions.includes(role)) &&
		member.user.id !== guildData.owner_id
	) {
		throw new error(403, 'User does not have permission to do this');
	}
	await prisma.roleMenu.create({
		data: {
			guildId: params.id,
			name: name,
		}
	});
	return new Response(
		JSON.stringify(
			await prisma.roleMenu.findMany({
				where: {
					guildId: params.id
				},
				select: {
					id: true,
					name: true,
					roles: true,
          max: true,
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

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const guild = await prisma.roleMenu.findMany({
		where: {
			guildId: params.id
		},
		select: {
			id: true,
			name: true,
			roles: true,
      max: true
		}
	});
	return new Response(JSON.stringify(guild), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies ,request, params }) {
	const member = await getMemberGuild(cookies.get('access_token'), params.id);
	const guild = await prisma.guild.findUnique({
		where: { guildId: params.id }
	});
	if (!member) {
		throw new error(404, 'User not found');
	}
	if (!guild) {
		throw new error(404, 'Guild not found');
	}
	const guildData = await getGuild(params.id);
	if (
		!member.roles.some((role) => guild?.permissions.includes(role)) &&
		member.user.id !== guildData.owner_id
	) {
		throw new error(403, 'User does not have permission to do this');
	}
	const menuId = request.json();
  console.log(menuId);
	await prisma.roleMenu.delete({
		where: {
			id: menuId
		}
	});
	return new Response(
		JSON.stringify(
			await prisma.roleMenu.findMany({
				where: {
					guildId: params.id
				},
				select: {
					id: true,
					name: true,
					roles: true,
          max: true
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
