const { MessageEmbed } = require("discord.js");
const { loadImage } = require("canvas");
const textEditCollector = require("./textEditCollector");
const { color } = require("../../config.json");
const textOptions = require("./textOptions");
const imageChoices = require("./imageChoices");
const editImageChoices = require("./editImageChoices");
const collectorEnd = require("./collectorEnd");
const renderImage = require("./renderImage");
const textCollector = require("./textCollector");
const imageEditButtonCollector = require("./imageEditButtonCollector");
module.exports = async function imageEditFunction(message, client) {
    await message.awaitMessageComponent({ max: 1, time: 600000, errors: ["time"] })
        .then(async collected => {
            if(collected.customId === "editText") {
                if(collected.values[0].startsWith("t")) {
                    const textEditEmbed = new MessageEmbed()
                        .setColor(color)
                        .setAuthor("Image Creation/Image Editing/Text Editing", client.user.displayAvatarURL())
                        .setFooter("Type `cancel` at any time to cancel this process")
                        .setDescription("Press one of the buttons below to edit this text object.");
                    const image = (await renderImage(client, message.channel.recipient)).toBuffer();
                    await collected.reply({ embeds: [textEditEmbed], components: textOptions, files: [image] });
                    await textEditCollector(await collected.fetchReply(), client, collected);
                }
                else {
                    const imageEditEmbed = new MessageEmbed()
                        .setColor(color)
                        .setAuthor("Image Creation/Image Editing/Image Editing", client.user.displayAvatarURL())
                        .setFooter("Type `cancel` at any time to cancel this process")
                        .setDescription("Press one of the buttons below to edit this image object.");
                    const image = (await renderImage(client, message.channel.recipient)).toBuffer();
                    await collected.reply({ embeds: [imageEditEmbed], components: editImageChoices, files: [image] });
                    await imageEditButtonCollector(await collected.fetchReply(), collected.values[0].split(" ")[1], client, collected.user);
                }
            }
            else if(collected.customId === "text") {
                const textEmbed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor("Image Creation/Image Editing/Text Creation", client.user.avatarURL())
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
            else if(collected.customId === "customImage") {
                const imageEmbed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor("Image Creation/Image Editing/Image Editing", client.user.avatarURL())
                    .setFooter("Type `cancel` at any time to cancel this process")
                    .setDescription("Please attach an image that you want to place on the image!");
                const customImageMessage = await collected.reply({ embeds: [imageEmbed] });
                const imageFilter = (m) => {
                    return m.attachments.size > 0 && !m.author.bot;
                };
                let choiceMessage;
                await collected.channel.awaitMessages({ filter: imageFilter, time: 60000, max: 1, errors: ["time"] })
                .then(async m => {
                    m = m.first();
                    const imageInput = await m.attachments.first().url;
                    const image = await loadImage(imageInput);
                    client.imageCreation.get(collected.user.id).images.push({
                        image: image,
                        imageName: m.attachments.first().name,
                        x: 0,
                        y: 0,
                        zoom: 0,
                        rotation: 0,
                    });
                    if(!client.imageCreation.has(collected.user.id)) return;
                    choiceMessage = await collected.user.send(await imageChoices(client, collected.user));
                    if(!client.imageCreation.has(collected.user.id)) return;
                    return imageEditFunction(choiceMessage, client);
                    })
                .catch((e) => {
                    console.log(e);
                    collectorEnd(customImageMessage, true, client);
                });
            }
            else if(collected.customId === "complete") {
                const image = (await renderImage(client, message.channel.recipient)).toBuffer();
                const completedEmbed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor("Image Creation/Completed", client.user.avatarURL())
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