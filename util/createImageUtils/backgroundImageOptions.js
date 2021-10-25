const { MessageActionRow, MessageButton } = require("discord.js");

const customImage = new MessageButton()
    .setCustomId("customImage")
    .setLabel("Custom Image")
    .setEmoji("🖼️")
    .setStyle("SUCCESS");
const customColor = new MessageButton()
    .setCustomId("customColor")
    .setLabel("Custom Color")
    .setEmoji("🎨")
    .setStyle("PRIMARY");
const black = new MessageButton()
    .setCustomId("black")
    .setLabel("Black")
    .setEmoji("⬛")
    .setStyle("SECONDARY");
const white = new MessageButton()
    .setCustomId("white")
    .setLabel("White")
    .setEmoji("⬜")
    .setStyle("SECONDARY");

const row = new MessageActionRow()
    .setComponents([customImage, customColor, black, white]);

module.exports = row;