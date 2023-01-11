import { getMemberGuild, getGuild } from '$lib/server/discord';
import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ cookies, request, params }) {
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
		!member.roles.some((role) => guild.permissions.includes(role)) &&
		member.user.id !== guildData.owner_id
	) {
		throw new error(403, 'User does not have permission to do this');
	}
	const { roles, max } = await request.json();
	await prisma.roleMenu.update({
		where: {
			id: params.role_id
		},
		data: {
			roles: roles,
			max: max
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

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ cookies, params }) {
	const member = await getMemberGuild(await cookies.get('access_token'), params.id);
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
		!member.roles.some((role) => guild.permissions.includes(role)) &&
		member.user.id !== guildData.owner_id
	) {
		throw new error(403, 'User does not have permission to do this');
	}
	await prisma.roleMenu.delete({
		where: {
			id: params.role_id
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
