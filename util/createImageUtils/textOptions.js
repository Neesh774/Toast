const { MessageButton, MessageActionRow } = require("discord.js");

const xMinusCoarse = new MessageButton()
    .setCustomId("x-40")
    .setLabel("-40")
    .setEmoji("◀️")
    .setStyle("PRIMARY");
const xMinusFine = new MessageButton()
    .setCustomId("x-5")
    .setLabel("-5")
    .setEmoji("◀️")
    .setStyle("PRIMARY");
const horizontal = new MessageButton()
    .setCustomId("horizontal")
    .setLabel("Horizontal")
    .setStyle("SECONDARY");
const xPlusFine = new MessageButton()
    .setCustomId("x+5")
    .setLabel("+5")
    .setEmoji("▶️")
    .setStyle("PRIMARY");
const xPlusCoarse = new MessageButton()
    .setCustomId("x+40")
    .setLabel("+40")
    .setEmoji("▶️")
    .setStyle("PRIMARY");
const horizontalRow = new MessageActionRow()
    .setComponents([xMinusCoarse, xMinusFine, horizontal, xPlusFine, xPlusCoarse]);

const yMinusCoarse = new MessageButton()
    .setCustomId("y-40")
    .setLabel("-40")
    .setEmoji("🔽")
    .setStyle("PRIMARY");
const yMinusFine = new MessageButton()
    .setCustomId("y-5")
    .setLabel("-5")
    .setEmoji("🔽")
    .setStyle("PRIMARY");
const vertical = new MessageButton()
    .setCustomId("vertical")
    .setLabel("Vertical")
    .setStyle("SECONDARY");
const yPlusFine = new MessageButton()
    .setCustomId("y+5")
    .setLabel("+5")
    .setEmoji("🔼")
    .setStyle("PRIMARY");
const yPlusCoarse = new MessageButton()
    .setCustomId("y+40")
    .setLabel("+40")
    .setEmoji("🔼")
    .setStyle("PRIMARY");
const verticalRow = new MessageActionRow()
    .setComponents([yMinusCoarse, yMinusFine, vertical, yPlusFine, yPlusCoarse]);

const textSizeMinusCoarse = new MessageButton()
    .setCustomId("t-10")
    .setLabel("-10")
    .setEmoji("🔻")
    .setStyle("PRIMARY");
const textSizeMinusFine = new MessageButton()
    .setCustomId("t-1")
    .setLabel("-1")
    .setEmoji("🔻")
    .setStyle("PRIMARY");
const textSize = new MessageButton()
    .setCustomId("textSize")
    .setLabel("Text Size")
    .setStyle("SECONDARY");
const textSizePlusFine = new MessageButton()
    .setCustomId("t+1")
    .setLabel("+1")
    .setEmoji("🔺")
    .setStyle("PRIMARY");
const textSizePlusCoarse = new MessageButton()
    .setCustomId("t+10")
    .setLabel("+10")
    .setEmoji("🔺")
    .setStyle("PRIMARY");
const textSizeRow = new MessageActionRow()
    .setComponents([textSizeMinusCoarse, textSizeMinusFine, textSize, textSizePlusFine, textSizePlusCoarse]);

const color = new MessageButton()
    .setCustomId("color")
    .setLabel("Color")
    .setEmoji("🎨")
    .setStyle("PRIMARY");
const back = new MessageButton()
    .setCustomId("back")
    .setLabel("Back")
    .setEmoji("⬅️")
    .setStyle("DANGER");
const colorRow = new MessageActionRow()
    .setComponents([color, back]);

module.exports = [horizontalRow, verticalRow, textSizeRow, colorRow];