module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag} (${client.user.id})`);

		const currentGuilds = client.guilds.cache.map((g) => g.id);

		if (currentGuilds.size <= 0) {
			return console.warn(
				"An error occurred while retrieving guild cache, or this bot isn't in any guilds. Data deletion will be skipped."
			);
		}

		const update = () => {
			client.user.setPresence({
				activities: [
					{
						name: `${client.guilds.cache.size} servers!`,
						type: "WATCHING",
					},
				],
			});
		};
		update();
		setInterval(update, 600000);
	},
};
