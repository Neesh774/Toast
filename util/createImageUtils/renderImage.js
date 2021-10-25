const { Canvas, loadImage } = require("canvas");
const { CanvasTextWrapper } = require("canvas-text-wrapper");

module.exports = async function renderImage(client, user) {
    const imageObj = client.imageCreation.get(user.id);
    if (!imageObj) return;
    const background = await loadImage(imageObj.background);
    const canvas = new Canvas(background.width, background.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(background, 0, 0, background.width, background.width);
    imageObj.text.forEach(textObj => {
        ctx.fillStyle = textObj.color;
        CanvasTextWrapper(canvas, textObj.text, {
            font: `${textObj.fontSize}px Arial`,
            paddingX: textObj.x < 10 ? 10 : textObj.x,
            paddingY: textObj.y < 10 ? 10 : textObj.y,
        });
    });
    return canvas;
};