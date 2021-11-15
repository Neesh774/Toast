const { Canvas } = require("canvas");
const collectorEnd = require("./collectorEnd");

module.exports = async function backgroundImageButtonFunction(backgroundEditMessage, image, client, user) {
    const backgroundImageButtonCollector = backgroundEditMessage.createMessageComponentCollector({ time: 60000 });
    let zoom = 1;
    let rotation = 0;
    const promise = new Promise((resolve) => {
        backgroundImageButtonCollector.on("collect", async (i) => {
            if(i.customId.startsWith("r")) {
                if(i.customId.startsWith("r+")) {
                    rotation += parseInt(i.customId.substring(2));
                }
                else {
                    rotation -= parseInt(i.customId.substring(2));
                }
                const modified = renderBackground(zoom, rotation, image);
                await i.message.removeAttachments();
                await i.update({ embeds: backgroundEditMessage.embeds, components: backgroundEditMessage.components, files: [modified] });
            }
            else if(i.customId.startsWith("z")) {
                if(i.customId.startsWith("z+")) {
                    zoom += 1;
                }
                else if(i.customId.startsWith("z-")) {
                    zoom -= 1;
                    if(zoom <= 0) {
                        zoom = 1;
                    }
                }
                const modified = renderBackground(zoom, rotation, image);
                await i.message.removeAttachments();
                await i.update({ embeds: backgroundEditMessage.embeds, components: backgroundEditMessage.components, files: [modified] });
            }
            else if(i.customId === "complete") {
                const finalImage = renderBackground(zoom, rotation, image);
                const imageObj = client.imageCreation.get(user.id);
                imageObj.background = finalImage;
                collectorEnd(backgroundEditMessage);
                await i.message.removeAttachments();
                await i.update({ embeds: backgroundEditMessage.embeds, components: backgroundEditMessage.components, attachments: [] });
                client.imageCreation.set(user.id, imageObj);
                resolve();
            }
        });

        backgroundImageButtonCollector.on("end", async () => {
            resolve(collectorEnd(backgroundEditMessage));
        });
    });
    return await promise;
};

function renderBackground(zoom, rotation, image) {
    const canvas = new Canvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(image, 0, 0, image.width * zoom, image.height * zoom);
    ctx.restore();
    return canvas.toBuffer();
}