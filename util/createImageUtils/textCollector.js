const average = require("image-average-color");
const invert = require("invert-color");
const renderImage = require("./renderImage");

const collectorEnd = require("./collectorEnd");

module.exports = async function textCollectorFunction(message, initialEmbed, user, client) {
    const filter = (m) => {
        return !m.author.bot && m.content.length < 200;
    };

    let collected = true;
    const collectedArray = await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ["time"] })
        .catch(() => {
            collected = false;
        });
    if(!collected) return collectorEnd(message, true, client);
    const image = (await renderImage(client, user));
    let imageBuffer = image.toBuffer();
    return await new Promise((resolve, reject) => {
        const m = collectedArray.first();
        average(imageBuffer, async (err, color) => {
            const fillStyle = invert([color[0], color[1], color[2]], true);
            const textSize = Math.floor(image.width / 15);
            const imageObject = client.imageCreation.get(user.id);
            if(!imageObject) reject();
            imageObject.text.push({
                text: m.content,
                fontSize: textSize,
                color: fillStyle,
                x: 0,
                y: 0,
            });
            client.imageCreation.set(user.id, imageObject);
            imageBuffer = (await renderImage(client, user)).toBuffer();
            await message.edit({ embeds: [initialEmbed], files: [imageBuffer] });
            resolve(imageObject);
        });
    });
};