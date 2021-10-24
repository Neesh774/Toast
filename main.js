console.log("Starting Toast...");

const mongoose = require("mongoose");
const { Client, Collection, Intents, Options } = require("discord.js");
const { readdirSync } = require("fs");

const config = require("./config.json");

const client = new Client({
	intents: [Intents.FLAGS.GUILDS],
	allowedMentions: { parse: [] },
	makeCache: Options.cacheWithLimits({
		MessageManager: 0,
		ThreadManager: 0,
	}),
});

client.admins = config.admins;
client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();

readdirSync("./commands").forEach(dir => {
	// if it's a command file
	if(dir.endsWith(".js")) {
		const command = require(`./commands/${dir}`);
		client.commands.set(command.data.name, command);
		if(command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => client.aliases.set(alias, command.name));
	}
	// if it's a directory of command files
	else {
		const category = dir;
		client.categories.set(category, new Collection());
		const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));

		for (const file of commands) {
			const pull = require(`./commands/${dir}/${file}`);
			if (pull.data.name) {
				client.commands.set(pull.data.name, pull);
				client.categories.get(category).set(pull.data.name, pull.data.description);
			}
		}
	}
});

const eventFiles = readdirSync("./events")
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

process.on("SIGINT", async () => {
	mongoose.connection.close(() => {
		console.log("Closed mongoDB connection");
		client.destroy();
		console.log("Destroyed client");
		process.exit(0);
	});
});

client.login(config.token);
