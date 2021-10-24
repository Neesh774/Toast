const Guild = require("../schemas/guild.js");

module.exports = {
	name: "guildDelete",
	once: false,
	async execute(guild) {
		await Guild.deleteOne({ _id: guild.id });
		console.log(`Deleted data for guild ${guild.name} (${guild.id})`);
	},
};