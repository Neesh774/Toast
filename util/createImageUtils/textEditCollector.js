const renderImage = require("./renderImage");
const textOptions = require("./textOptions");

module.exports = async function textEditFunction(message, client, interaction) {
    const imageObj = client.imageCreation.get(interaction.user.id);
    const index = parseInt(interaction.values[0]);
    const text = client.imageCreation.get(interaction.user.id).text[index];
    await message.awaitMessageComponent({ max: 1, time: 60000, errors: ["time"] })
        .then(async i => {
            if(i.customId.startsWith("x+") || i.customId.startsWith("x-")) {
                i.customId.startsWith("x+") ? text.x += parseInt(i.customId.substring(2)) : text.x -= parseInt(i.customId.substring(2));
                if(text.x < 10) text.x = 10;
                imageObj.splice(index, 1, text);
                const image = (await renderImage(client, i.user)).toBuffer();
                await message.edit({ embeds: message.embeds, components: textOptions, files: [image] });
            }
            else if(i.customId.startsWith("t+") || i.customId.startsWith("t-")) {}
            else if(i.customId === "horizontal" || i.customId === "vertical") {}
            else if(i.customId === "textSize") {}
            else if(i.customId === "color") {}
            else if(i.customId === "cancel") {}
        });
};