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
const imageEditCollector = require("../util/createImageUtils/imageEditCollector");

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
        await interaction.editReply({ content: "Check your DMs!" });
		const initialEmbed = new MessageEmbed()
			.setColor(color)
			.setAuthor("Image Creation/Background Creation", client.user.avatarURL())
			.setFooter("Type `cancel` at any time to cancel this process")
			.setDescription("Please select what kind of background you want!");
		const initialMessage = await interaction.user.send({ embeds: [initialEmbed], components: [backgroundImageButtons] })
			.catch(() => { return interaction.editReply("I can't DM you! Please enable DMs for this server, or allow DMs from"); });
		if(initialMessage.content) return;
		const DMChannel = initialMessage.channel;
		client.imageCreation.set(interaction.user.id, {
			background: null,
			text: [],
		});
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

		let canvas = Canvas.createCanvas(500, 500);
        let ctx = canvas.getContext("2d");
		if(!client.imageCreation.has(interaction.user.id)) return;
		const editedCanvas = await backgroundButtonCollectorFunction(initialMessage, initialEmbed, ctx, canvas, interaction.user, client);
		if(editedCanvas) {
			canvas = editedCanvas;
			ctx = canvas.getContext("2d");
		}

		if(!client.imageCreation.has(interaction.user.id)) return;
		const textEmbed = new MessageEmbed()
			.setColor(color)
			.setAuthor("Image Creation/Text Creation", client.user.avatarURL())
			.setFooter("Type `cancel` at any time to cancel this process")
			.setDescription("Please enter the text you want to place on the image! Type `skip` if you don't want any text!");
		const textMessage = await interaction.user.send({ embeds: [textEmbed] });

		let choiceMessage;
		await textCollector(textMessage, textEmbed, interaction.user, client).then(async () => {
			if(!client.imageCreation.has(interaction.user.id)) return;
			choiceMessage = await interaction.user.send(await imageChoices(client, interaction.user));
		});
		if(!client.imageCreation.has(interaction.user.id)) return;
		imageEditCollector(choiceMessage, client);
	},
};