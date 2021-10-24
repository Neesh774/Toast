const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token, disabledCommands, clientId } = require("./config.json");
const { readdirSync } = require("fs");

const commands = [];
const commandFiles = [];
readdirSync("./commands").forEach(dir => {
	// if it's a command file
	if(dir.endsWith(".js")) {
		const pull = require(`./commands/${dir}`);
		if (pull.data.name && !disabledCommands.includes(pull.name)) {
			commandFiles.push(pull);
		}
	}
	// if it's a directory of command files
	else {
		readdirSync(`./commands/${dir}`).forEach(file => {
			const pull = require(`./commands/${dir}/${file}`);
			if (pull.data.name && !disabledCommands.includes(pull.data.name)) {
				commandFiles.push(pull);
			}
		});
	}
});
const [, , guildId] = process.argv;

for (const file of commandFiles) {
	commands.push(file.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");
		if (guildId) {
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
				body: commands,
			});
		} else {
			await rest.put(Routes.applicationCommands(clientId), {
				body: commands,
			});
		}

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
