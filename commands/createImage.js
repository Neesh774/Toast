// Resources
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Canvas = require("canvas");
const { color } = require("../config.json");

// Components
const backgroundImageButtons = require("../util/createImageUtils/backgroundImageOptions");
const imageChoices = require("../util/createImageUtils/imageChoices");

// Collectors
const backgroundButtonCollectorFunction = require("../util/createImageUtils/backgroundButtonCollector");
const textCollector = require("../util/createImageUtils/textCollector");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("create_image")
		.setDescription("Create an image and place text on it!"),
	cooldown: 1,
	guildOnly: false,
	ephemeral: true,
	async execute(interaction, client) {
		if(client.imageCreation.has(interaction.user.id)) {
			return interaction.editReply("You are already creating an image!");
		}
		client.imageCreation.set(interaction.user.id, {
			background: null,
			text: [],
		});
        await interaction.editReply({ content: "Check your DMs!" });
		const initialEmbed = new MessageEmbed()
			.setColor(color)
			.setAuthor("Step 1", client.user.avatarURL())
			.setFooter("Type `cancel` at any time to cancel this process")
			.setDescription("Please select what kind of background you want!");
		const initialMessage = await interaction.user.send({ embeds: [initialEmbed], components: [backgroundImageButtons] });
		const DMChannel = initialMessage.channel;

		const cancelCollectorFilter = (message) => {
			return message.content.toLowerCase() === "cancel" && !message.author.bot;
		};
		const cancelCollector = DMChannel.createMessageCollector({ filter: cancelCollectorFilter, max: 1 });
		cancelCollector.on("collect", async (message) => {
			const cancelEmbed = new MessageEmbed()
				.setColor(color)
				.setAuthor("Cancelled", client.user.avatarURL())
				.setDescription("Successfully cancelled your image creation!");
			client.imageCreation.delete(interaction.user.id);
			return await message.channel.send({ embeds: [cancelEmbed] });
		});

		const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext("2d");

		await backgroundButtonCollectorFunction(initialMessage, initialEmbed, ctx, canvas, interaction.user, client);

		const textEmbed = new MessageEmbed()
			.setColor(color)
			.setAuthor("Step 2", client.user.avatarURL())
			.setFooter("Type `cancel` at any time to cancel this process")
			.setDescription("Please enter the text you want to place on the image!");
		const textMessage = await interaction.user.send({ embeds: [textEmbed] });
		let choiceMessage;
		textCollector(textMessage, textEmbed, ctx, canvas, interaction.user, client).then(async () => {
			const choiceEmbed = new MessageEmbed()
				.setColor(color)
				.setAuthor("Step 3", client.user.avatarURL())
				.setFooter("Type `cancel` at any time to cancel this process")
				.setDescription("Press one of the buttons below to continue.");
			choiceMessage = await interaction.user.send({ embeds: [choiceEmbed], components: imageChoices(client, interaction.user) });
		});
	},
};