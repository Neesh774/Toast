const { Collection } = require("discord.js");
const { disabledCommands, admins } = require("../config.json");

const cooldowns = new Collection();

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction, client) {
		const { commandName, user, member } = interaction;

		if (!interaction.isCommand() && !interaction.isContextMenu()) return;

		const command = client.commands.get(commandName);
		if (!command) return;

		if (disabledCommands?.includes?.(commandName)) {
			return interaction.reply({
				content: "❌ **|** That command is currently disabled.",
				ephemeral: true,
			});
		}

		if (command.guildOnly && !interaction.inGuild()) {
			return interaction.reply({
				content:
					"❌ **|** That command can only be used inside servers.",
				ephemeral: true,
			});
		}
		const isAdmin = client.admins.includes(user.id);
		if (!isAdmin && command.cooldown) {
			if (!cooldowns.has(commandName)) {
				cooldowns.set(commandName, new Collection());
			}
			const now = Date.now();
			const timestamps = cooldowns.get(commandName);
			const cooldownAmount = command.cooldown * 1000;

			if (timestamps.has(user.id)) {
				const expirationTime = timestamps.get(user.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = ((expirationTime - now) / 1000).toFixed(0);
					return interaction.reply({
						content: `🛑 **|** That command is on cooldown! Wait ${timeLeft} second(s) before using it again.`,
						ephemeral: true,
					});
				}
			}
			timestamps.set(user.id, now);
			setTimeout(() => timestamps.delete(user.id), cooldownAmount);
		}
		if (!isAdmin && command.permission) {
			const isManager = member.permissions.has("MANAGE_GUILD");
			if (command.permission === "manage") {
				if (!isManager) {
					return await interaction.reply({
						content:
							"✋ **|** That action requires the **Manage Guild** permission.",
						ephemeral: true,
					});
				}
			}
			if (command.permission === "admin") {
				if (!admins.includes(user.id)) {
					return await interaction.reply({
						content:
							"✋ **|** That action requires the **Bot Administrator** permission.",
						ephemeral: true,
					});
				}
			}
		}
		try {
			await interaction.deferReply({ epehemeral: command.ephemeral });
			await command.execute(interaction, client);
		} catch (error) {
			console.error(`Failed to execute command ${commandName}
* ${error.stack}`);

			interaction.editReply({
				content:
					"❌ **|** Something went wrong while executing that command!",
				ephemeral: true,
			});
		}
	},
};
