const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { version } = require("../../package.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Displays information about Toast"),
	cooldown: 1,
	guildOnly: false,
	async execute(interaction) {
		const {
			client: { uptime, guilds, ws },
			createdTimestamp,
		} = interaction;

		const now = new Date().getTime();

		const serverCount = guilds.cache.size;
		const msgPing = now - createdTimestamp;
        const time = Math.floor(new Date(now - uptime).getTime() / 1000);
		const startedAt = `<t:${time}:R>`;
		const memberCount = guilds.cache
			.reduce((acc, g) => acc + g.memberCount, 0)
			.toLocaleString();

		await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle("💬 Information")
					.setColor("BLUE")
					.setDescription(
						`The one-stop discord bot that you need for all of your image generating needs. Memes, quotes, random images with text, Toast's got it all!
**[🤖 Add Toast to your server](https://discord.com/api/oauth2/authorize?client_id=900462740483764295&permissions=377957435456&scope=bot%20applications.commands)**
[🙋 Support Server](https://discord.gg/4Hd8MxuJkv) 
[🐛 Report Bugs](https://github.com/Neesh774/Toast/issues/new/choose)
[🛠️ Source Code](https://github.com/Neesh774/Toast)
[❗ More Info](https://bit.ly/3CdR299)`
					)
					.addField(
						"Server Count",
						`I'm in **${serverCount}** servers with a total of **${memberCount}** members!`,
						true
					)
					.addField(
						"Uptime",
						`Online since **${startedAt}**!`,
						true
					)
					.addField(
						"Latency",
						`I received your message in \`${msgPing}\`ms. WebSocket ping is \`${ws.ping}\`ms`,
						true
					)
					.setFooter(`Toast v${version}`),
			],
		});
	},
};