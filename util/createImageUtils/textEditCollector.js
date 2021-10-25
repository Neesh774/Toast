const { parse, convert } = require("pure-color");
const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");

const renderImage = require("./renderImage");
const textOptions = require("./textOptions");
const imageChoices = require("./imageChoices");
const collectorEnd = require("./collectorEnd");

module.exports = async function textEditFunction(message, client, interaction) {
    const imageObj = client.imageCreation.get(interaction.user.id);
    const index = parseInt(interaction.values[0]);
    const text = client.imageCreation.get(interaction.user.id).text[index];
    const buttonCollector = message.createMessageComponentCollector({ time: 60000 });
    buttonCollector.on("collect", async (i) => {
        if(i.customId.startsWith("x+") || i.customId.startsWith("x-")) {
            i.customId.startsWith("x+") ? text.x += parseInt(i.customId.substring(2)) : text.x -= parseInt(i.customId.substring(2));
            if(text.x < 10) text.x = 10;
            imageObj.text.splice(index, 1, text);
            const image = (await renderImage(client, i.user)).toBuffer();
            await i.message.removeAttachments();
            await i.update({ embeds: message.embeds, components: textOptions, files: [image], attachments: [] });
        }
        else if(i.customId.startsWith("y+") || i.customId.startsWith("y-")) {
            i.customId.startsWith("y+") ? text.y -= parseInt(i.customId.substring(2)) : text.y += parseInt(i.customId.substring(2));
            if(text.y < 10) text.y = 10;
            imageObj.text.splice(index, 1, text);
            const image = (await renderImage(client, i.user)).toBuffer();
            await i.message.removeAttachments();
            await i.update({ embeds: message.embeds, components: textOptions, files: [image], attachments: [] });
        }
        else if(i.customId.startsWith("t+") || i.customId.startsWith("t-")) {
            i.customId.startsWith("t+") ? text.fontSize += parseInt(i.customId.substring(2)) : text.fontSize -= parseInt(i.customId.substring(2));
            if(text.fontSize < 0) text.fontSize = 20;
            imageObj.text.splice(index, 1, text);
            const image = (await renderImage(client, i.user)).toBuffer();
            await i.message.removeAttachments();
            await i.update({ embeds: message.embeds, components: textOptions, files: [image], attachments: [] });
        }
        else if(i.customId === "horizontal" || i.customId === "vertical") {
            if(i.customId === "horizontal") return i.reply(`The current horizontal value is at ${text.x}`);
            if(i.customId === "vertical") return i.reply(`The current vertical value is at ${text.y}`);
        }
        else if(i.customId === "textSize") {
            return i.reply(`The current text size is at ${text.fontSize}`);
        }
        else if(i.customId === "color") {
            const colorFilter = (m) => {
                return parse(m.content) && !m.author.bot;
            };
            const customColorEmbed = new MessageEmbed()
                .setColor(color)
                .setFooter("Type `cancel` at any time to end this process")
                .setAuthor("Image Creation / Image Editing / Custom Color", client.user.avatarURL())
                .setDescription("Please enter the color you want your background to be in the format #`ffffff`, or rgb(`r`, `g`, `b`)");
            await i.reply({ embeds: [customColorEmbed] });

            await i.channel.awaitMessages({ filter: colorFilter, time: 60000, max: 1, errors: ["time"] })
                .then(async m => {
                    m = m.first();
                    const selectedColor = convert.rgb.hex(parse(m.content));
                    if(selectedColor) {
                        text.color = selectedColor;
                        imageObj.text.splice(index, 1, text);
                        const image = (await renderImage(client, i.user)).toBuffer();
                        await i.message.removeAttachments();
                        await i.update({ embeds: message.embeds, components: textOptions, files: [image], attachments: [] });
                    }
                    else {
                        m.reply("Please enter a valid color!");
                    }
                })
                .catch(async () => {
                    const newChoices = await message.channel.send(await imageChoices(client, i.user));
                    await require("./imageEditCollector")(newChoices, client);
                });
        }
        else if(i.customId === "back") {
            await i.message.removeAttachments();
            await i.update(await imageChoices(client, i.user));
            await require("./imageEditCollector")(await i.fetchReply(), client);
        }
    });
    buttonCollector.on("end", async () => {collectorEnd(message);});
};