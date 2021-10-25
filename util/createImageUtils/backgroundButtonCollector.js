const { parse, convert } = require("pure-color");
const { MessageEmbed } = require("discord.js");
const { Canvas } = require("canvas");
const { loadImage } = require("canvas");
const { color } = require("../../config.json");
const collectorEnd = require("./collectorEnd");

module.exports = async function backgroundButtonCollectorFunction(initialMessage, initialEmbed, ctx, canvas, user, client) {
    const backgroundButtonCollectorFilter = (i) => {
        return i.user.id === user.id;
    };

    await initialMessage.awaitMessageComponent({ filter: backgroundButtonCollectorFilter, time: 60000, max: 1, errors: ["time"] })
        .then(async i => {
            await i.update(collectorEnd(initialMessage));

        // BLACK OR WHITE
        if(i.customId === "black" || i.customId === "white") {
            ctx.fillStyle = i.customId;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            i.editReply("Successfully set the background!");
            await initialMessage.edit({ embeds: [initialEmbed], files: [canvas.toBuffer("image/jpeg")] });
        }
        // CUSTOM COLOR
        else if(i.customId === "customColor") {
            const colorFilter = (m) => {
                return parse(m.content) && !m.author.bot;
            };
            const customColorEmbed = new MessageEmbed()
                .setColor(color)
                .setAuthor("Image Creation / Background Creation / Custom Color", client.user.avatarURL())
                .setFooter("Type `cancel` at any time to end this process")
                .setDescription("Please enter the color you want your background to be in the format #`ffffff`, or rgb(`r`, `g`, `b`)");
            const customColorMessage = await i.channel.send({ embeds: [customColorEmbed] });

            await i.channel.awaitMessages({ filter: colorFilter, time: 30000, max: 1, errors: ["time"] })
                .then(async m => {
                    m = m.first();
                    const selectedColor = convert.rgb.hex(parse(m.content));
                    if(selectedColor) {
                        ctx.fillStyle = selectedColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        m.reply("Successfully set the background!");
                        await initialMessage.edit({ files: [canvas.toBuffer("image/jpeg")] });
                    }
                    else {
                        m.reply("Please enter a valid color!");
                    }
                })
                .catch(() => {
                    collectorEnd(customColorMessage, true, client);
                });
        }

        // CUSTOM IMAGE
        else if(i.customId === "customImage") {
            const imageFilter = (m) => {
                return m.attachments.size > 0 && !m.author.bot;
            };
            const customImageEmbed = new MessageEmbed()
                .setColor(color)
                .setAuthor("Image Creation / Background Creation / Custom Image", client.user.avatarURL())
                .setDescription("Please attach an image to be used as the background!");
            const customImageMessage = await i.channel.send({ embeds: [customImageEmbed] });

            await i.channel.awaitMessages({ filter: imageFilter, time: 60000, max: 1, errors: ["time"] })
                .then(async m => {
                    m = m.first();
                    const imageInput = await m.attachments.first().url;
                    const image = await loadImage(imageInput);
                    canvas = new Canvas(image.width, image.height);
                    ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    m.reply("Successfully set the background!");
                    await initialMessage.edit({ files: [canvas.toBuffer("image/jpeg")] });
                })
                .catch(() => { collectorEnd(customImageMessage, true, client);});
        }
        })
        .catch(async () => {collectorEnd(initialMessage, true, client);});

        if(client.imageCreation.has(user.id)) {
            const imageObject = client.imageCreation.get(user.id);
            imageObject.background = canvas.toBuffer("image/jpeg");
            client.imageCreation.set(user.id, imageObject);
            return canvas;
        }
};