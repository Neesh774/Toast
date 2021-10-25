const { CanvasTextWrapper } = require("canvas-text-wrapper");
const average = require("image-average-color");
const invert = require("invert-color");

const collectorEnd = require("./collectorEnd");

module.exports = async function textCollectorFunction(message, initialEmbed, ctx, canvas, user, client) {
    const filter = (m) => {
        return !m.author.bot && m.content.length < 200;
    };

    let collected = true;
    const collectedArray = await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ["time"] })
        .catch(() => {
            collected = false;
        });
    if(!collected) return collectorEnd(message, true, client);
    return await new Promise((resolve, reject) => {
        const m = collectedArray.first();
        average(canvas.toBuffer(), async (err, color) => {
            ctx.fillStyle = invert([color[0], color[1], color[2]], true);
            const textSize = Math.floor(canvas.width / 15);
            CanvasTextWrapper(canvas, m.content, {
                font: `${textSize}px Arial`,
                paddingX: 10,
                paddingY: 10,
                maxFontSizeToFill: 200,
            });
            const imageObject = client.imageCreation.get(user.id);
            if(!imageObject) reject();
            imageObject.text.push({
                text: m.content,
                fontSize: textSize,
                color: ctx.fillStyle,
                x: 0,
                y: 0,
            });
            client.imageCreation.set(user.id, imageObject);
            await message.edit({ embeds: [initialEmbed], files: [canvas.toBuffer("image/jpeg")] });
            resolve(imageObject);
        });
    });
};