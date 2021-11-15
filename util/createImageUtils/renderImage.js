const { Canvas, loadImage } = require("canvas");
const { CanvasTextWrapper } = require("canvas-wrapper");

module.exports = async function renderImage(client, user) {
    const imageObj = client.imageCreation.get(user.id);
    if (!imageObj) return;
    const background = await loadImage(imageObj.background);
    const canvas = new Canvas(background.width, background.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(background, 0, 0, background.width, background.width);
    imageObj.images.forEach(textObj => {
        if(textObj.x > canvas.width) textObj.x = canvas.width;
        if(textObj.y > canvas.height) textObj.y = canvas.height;
        if(textObj.x < 0) textObj.x = 0;
        if(textObj.y < 0) textObj.y = 0;
        ctx.drawImage(textObj.image, textObj.x, textObj.y);
    });
    imageObj.text.forEach(textObj => {
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
    return canvas;
};