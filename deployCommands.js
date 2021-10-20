/*
Copyright (C) 2020-2021 Nicholas Christopher

This file is part of Toast.

Toast is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, version 3.

Toast is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Toast.  If not, see <https://www.gnu.org/licenses/>.
*/

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token, disabledCommands, clientId } = require("./config.json");
const fs = require("fs");

const commands = [];
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

const [, , guildId] = process.argv;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (disabledCommands?.includes(command.data.name)) continue;
	commands.push(command.data.toJSON());
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
