const { Canvas, loadImage } = require("canvas");
const { CanvasTextWrapper } = require("canvas-wrapper");
const collectorEnd = require("./collectorEnd");

module.exports = async function imageEditButtonFunction(imageEditMessage, imageName, client, user) {
    const imageEditCollector = imageEditMessage.createMessageComponentCollector({ time: 60000 });
    let size = 1;
    let rotation = 0;
    let x = 0;
    let y = 0;
    const promise = new Promise((resolve) => {
        imageEditCollector.on("collect", async (i) => {
            if(i.customId.startsWith("r")) {
                if(i.customId.startsWith("r+")) {
                    rotation += parseInt(i.customId.substring(2));
                }
                else {
                    rotation -= parseInt(i.customId.substring(2));
                }
                const modified = await renderImage(client, user, size, rotation, x, y, imageName);
                await i.message.removeAttachments();
                await i.update({ embeds: imageEditMessage.embeds, components: imageEditMessage.components, files: [modified] });
            }
            else if(i.customId.startsWith("s")) {
                if(i.customId.startsWith("s+")) {
                    size += 1;
                }
                else if(i.customId.startsWith("s-")) {
                    size -= 0.25;
                    if(size <= 0) {
                        size = 0.25;
                    }
                }
                const modified = await renderImage(client, user, size, rotation, x, y, imageName);
                await i.message.removeAttachments();
                await i.update({ embeds: imageEditMessage.embeds, components: imageEditMessage.components, files: [modified] });
            }
            else if(i.customId.startsWith("m")) {
                if(i.customId.startsWith("ml")) {
                    x -= 20;
                }
                else if(i.customId.startsWith("mr")) {
                    x += 20;
                }
                else if(i.customId.startsWith("mu")) {
                    y -= 20;
                }
                else if(i.customId.startsWith("md")) {
                    y += 20;
                }
                const modified = await renderImage(client, user, size, rotation, x, y, imageName);
                await i.message.removeAttachments();
                await i.update({ embeds: imageEditMessage.embeds, components: imageEditMessage.components, files: [modified] });
            }
            else if(i.customId === "complete") {
                const finalImage = await renderImage(client, user, size, rotation, x, y, imageName);
                const imageObj = client.imageCreation.get(user.id);
                imageObj.background = finalImage;
                collectorEnd(imageEditMessage);
                await i.message.removeAttachments();
                await i.update({ embeds: imageEditMessage.embeds, components: imageEditMessage.components, attachments: [] });
                client.imageCreation.set(user.id, imageObj);
                resolve();
            }
        });

        imageEditCollector.on("end", async () => {
            resolve(collectorEnd(imageEditMessage));
        });
    });
    return await promise;
};

async function renderImage(client, user, size, rotation, x, y, imageName) {
    const imageObj = client.imageCreation.get(user.id);
    if (!imageObj) return;
    const background = await loadImage(imageObj.background);
    const canvas = new Canvas(background.width, background.height);
    const bgCtx = canvas.getContext("2d");
    bgCtx.drawImage(background, 0, 0, background.width, background.width);
    await imageObj.images.forEach(async instObj => {
        const ctx = canvas.getContext("2d");
        if(x > canvas.width) x = canvas.width;
        if(y > canvas.height) y = canvas.height;
        if(x < 0) x = 0;
        if(y < 0) y = 0;
        if(instObj.imageName === imageName) {
            ctx.translate((instObj.image.width / 2) + x, (instObj.image.height / 2) + y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.drawImage(instObj.image, (-instObj.image.width / 2 + x), (-instObj.image.height / 2) + y, instObj.image.width * size, instObj.image.height * size);
        }
        else {
            ctx.drawImage(instObj.image, instObj.x, instObj.y);
        }
    });
    imageObj.text.forEach(textObj => {
        const ctx = canvas.getContext("2d");
        if(textObj.x > canvas.width) textObj.x = canvas.width;
        if(textObj.y > canvas.height) textObj.y = canvas.height;
        if(textObj.x < 0) textObj.x = 0;
        if(textObj.y < 0) textObj.y = 0;
        ctx.fillStyle = textObj.color;
        CanvasTextWrapper(canvas, textObj.text, {
            font: `${textObj.fontSize}px Arial`,
            offsetX: textObj.x,
            offsetY: textObj.y,
            maxWidth: canvas.width - textObj.x,
        });
    });
    return canvas.toBuffer();
};