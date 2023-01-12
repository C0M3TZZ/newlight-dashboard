const DISCORD_API_URL = import.meta.env.VITE_DISCORD_API_URL;
const DISCORD_BOT_TOKEN = import.meta.env.VITE_DISCORD_BOT_TOKEN

export const getUser = async (accessToken) => {
  const req_user = await fetch(`${DISCORD_API_URL}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!req_user.ok) {
    return null;
  }
  const user = await req_user.json();
  return user;
}

export const getGuild = async (guildId) => {
  const req_guild = await fetch(`${DISCORD_API_URL}/guilds/${guildId}`, {
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`
		}
	});
  const getGuild = await req_guild.json();
	if (getGuild.code === 50001) {
		return null;
	}
  return getGuild;
}

export const isOwner = async (guildId, access_token) => {
  const user = await getUser(access_token);
  console.log(user);
  const guild = await getGuild(guildId);
  console.log(guild);
  if (!user || !guild) {
    return false;
  }
  if (user.id === guild.owner_id) {
    return true;
  }
  return false;
}

export const getMemberGuild = async (access_token, guildId) => {
  const user = await getUser(access_token);
  if (!user) {
    return null;
  }
  const req_guild = await fetch(`${DISCORD_API_URL}/guilds/${guildId}/members/${await user.id}`, {
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`
    }
  });
  if (!req_guild.ok) {
    return null;
  }
  const getGuild = await req_guild.json();
  return getGuild;
}
