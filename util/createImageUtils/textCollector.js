const { CanvasTextWrapper } = require("canvas-text-wrapper");
const average = require("image-average-color");
const invert = require("invert-color");

const collectorEnd = require("./collectorEnd");

module.exports = async function textCollectorFunction(message, initialEmbed, ctx, canvas, user, client) {
    const filter = m => m.author.id === user.id;

    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
        .catch(() => {
            collectorEnd(message, true, client);
        });

    const m = collected.first();
    if (m.content.length > 200) {
        return await message.channel.send("Your text is too long. Please try again.");
    }
    await new Promise((resolve) => {
        average(canvas.toBuffer(), async (err, color) => {
            ctx.fillStyle = invert([color[0], color[1], color[2]], true);
            CanvasTextWrapper(canvas, m.content, {
                font: "30px Arial",
                paddingX: 10,
                paddingY: 10,
                maxFontSizeToFill: 200,
            });
            const imageObject = client.imageCreation.get(user.id);
            imageObject.text.push({
                text: m.content,
                color: ctx.fillStyle,
                x: 0,
                y: 0,
                width: 500,
                height: 500,
                rotation: 0,
            });
            client.imageCreation.set(user.id, imageObject);
            await message.edit({ embeds: [initialEmbed], files: [canvas.toBuffer("image/jpeg")] });
            resolve(imageObject);
        });
    });
};