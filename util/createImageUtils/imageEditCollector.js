const { MessageEmbed } = require("discord.js");
const textEditCollector = require("./textEditCollector");
const { color } = require("../../config.json");
const textOptions = require("./textOptions");
const imageChoices = require("./imageChoices");
const collectorEnd = require("./collectorEnd");
const renderImage = require("./renderImage");
const textCollector = require("./textCollector");
module.exports = async function imageEditFunction(message, client) {
    await message.awaitMessageComponent({ max: 1, time: 600000, errors: ["time"] })
        .then(async collected => {
            if(collected.customId === "editText") {
                const textEditEmbed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor("Image Creation / Image Editing / Text Editing", client.user.displayAvatarURL())
                    .setFooter("Type `cancel` at any time to cancel this process")
                    .setDescription("Press one of the buttons below to edit this text object.");
                const image = (await renderImage(client, message.channel.recipient)).toBuffer();
                await collected.reply({ embeds: [textEditEmbed], components: textOptions, files: [image] });
                await textEditCollector(await collected.fetchReply(), client, collected);
            }
            else if(collected.customId === "text") {
                const textEmbed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor("Image Creation / Image Editing / Text Creation", client.user.avatarURL())
                    .setFooter("Type `cancel` at any time to cancel this process")
                    .setDescription("Please enter the text you want to place on the image!");
                await collected.reply({ embeds: [textEmbed] });
                let choiceMessage;
                await textCollector(await collected.fetchReply(), textEmbed, collected.user, client).then(async () => {
                    if(!client.imageCreation.has(collected.user.id)) return;
			        choiceMessage = await collected.user.send(await imageChoices(client, collected.user));
                });
                if(!client.imageCreation.has(collected.user.id)) return;
                return imageEditFunction(choiceMessage, client);
            }
            else if(collected.customId === "complete") {
                const image = (await renderImage(client, message.channel.recipient)).toBuffer();
                const completedEmbed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor("Image Creation / Completed", client.user.avatarURL())
                    .setTitle("Image Created")
                    .setFooter(collected.user.username, collected.user.avatarURL());
                await collected.reply({ embeds: [completedEmbed] });
                await collected.channel.send({ files: [image] });
                return client.imageCreation.delete(collected.user.id);
            }
        })
        .catch((e) => {
            console.log(e);
            collectorEnd(message, true, client);
        });
};