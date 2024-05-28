const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  ButtonStyle,
  userMention,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
} = require("discord.js");
const config = require('./config');

const client = new Client({
  intents: 131071,
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!\n\nIndex.js  ✅\n`);
  client.user.setActivity(config.activity.name, { type: config.activity.type, url: config.activity.url });
  client.user.setStatus(config.status);
});
///////Alpha Store
const roles = new Map();

client.on("guildMemberRemove", (member) => {
  roles.set(member.id, member.roles.cache.map(role => role.id));
});

client.on('guildMemberAdd', async (member) => {
  if (roles.has(member.id)) {
    const savedRoles = roles.get(member.id);
    await member.roles.add(savedRoles);
    
    const channel = await client.channels.fetch(config.notifyChannelId);
    const roleMentions = savedRoles.map(roleId => `<@&${roleId}>`).join(', ');

    if (channel) {
      channel.send(`تم حفظ الرتب التالية للعضو ${member}: ${roleMentions}`);
    }
    
    roles.delete(member.id);
  }
});

client.login(config.token);
