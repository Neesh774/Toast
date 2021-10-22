const { blockedGuilds } = require("../config.json");

module.exports = {
	name: "guildCreate",
	once: false,
	async execute(guild) {
		if (blockedGuilds?.includes?.(guild.id)) {
			guild.leave();
		}
	},
};
