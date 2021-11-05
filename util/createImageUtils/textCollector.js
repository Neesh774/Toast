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
    const image = await renderImage(client, user);
    const m = collectedArray.first();
    if(m.content.toLowerCase() === "cancel") return;
    let imageBuffer = image.toBuffer();
    return await new Promise((resolve, reject) => {
        if(m.content.toLowerCase() === "skip") {
            imageBuffer = (renderImage(client, user)).then(imageCanvas => imageCanvas.toBuffer());
            return resolve(imageBuffer);
        }
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
            resolve(imageObject);
        });
    });
};