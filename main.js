console.log("Starting Toast...");

const { Client, Collection, Intents, Options } = require("discord.js");
const fs = require("fs");

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

const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));
const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

process.on("SIGINT", async () => {
	client.destroy();
	console.log("Destroyed client");
	process.exit(0);
});

client.login(config.token);
