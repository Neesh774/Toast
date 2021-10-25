const { MessageButton, MessageActionRow } = require("discord.js");

const xMinusTwenty = new MessageButton()
    .setCustomId("x-20")
    .setLabel("-20")
    .setEmoji("◀️")
    .setStyle("PRIMARY");
const xMinusFive = new MessageButton()
    .setCustomId("x-5")
    .setLabel("-5")
    .setEmoji("◀️")
    .setStyle("PRIMARY");
const horizontal = new MessageButton()
    .setCustomId("horizontal")
    .setLabel("Horizontal")
    .setStyle("SECONDARY");
const xPlusFive = new MessageButton()
    .setCustomId("x+5")
    .setLabel("+5")
    .setEmoji("▶️")
    .setStyle("PRIMARY");
const xPlusTwenty = new MessageButton()
    .setCustomId("x+20")
    .setLabel("+20")
    .setEmoji("▶️")
    .setStyle("PRIMARY");
const horizontalRow = new MessageActionRow()
    .setComponents([xMinusTwenty, xMinusFive, horizontal, xPlusFive, xPlusTwenty]);

const yMinusTwenty = new MessageButton()
    .setCustomId("y-20")
    .setLabel("-20")
    .setEmoji("🔽")
    .setStyle("PRIMARY");
const yMinusFive = new MessageButton()
    .setCustomId("y-5")
    .setLabel("-5")
    .setEmoji("🔽")
    .setStyle("PRIMARY");
const vertical = new MessageButton()
    .setCustomId("vertical")
    .setLabel("Vertical")
    .setStyle("SECONDARY");
const yPlusFive = new MessageButton()
    .setCustomId("y+5")
    .setLabel("+5")
    .setEmoji("🔼")
    .setStyle("PRIMARY");
const yPlusTwenty = new MessageButton()
    .setCustomId("y+20")
    .setLabel("+20")
    .setEmoji("🔼")
    .setStyle("PRIMARY");
const verticalRow = new MessageActionRow()
    .setComponents([yMinusTwenty, yMinusFive, vertical, yPlusFive, yPlusTwenty]);

const textSizeMinusTen = new MessageButton()
    .setCustomId("t-10")
    .setLabel("-10")
    .setEmoji("🔻")
    .setStyle("PRIMARY");
const textSizeMinusOne = new MessageButton()
    .setCustomId("t-1")
    .setLabel("-1")
    .setEmoji("🔻")
    .setStyle("PRIMARY");
const textSize = new MessageButton()
    .setCustomId("textSize")
    .setLabel("Text Size")
    .setStyle("SECONDARY");
const textSizePlusOne = new MessageButton()
    .setCustomId("t+1")
    .setLabel("+1")
    .setEmoji("🔺")
    .setStyle("PRIMARY");
const textSizePlusTen = new MessageButton()
    .setCustomId("t+10")
    .setLabel("+10")
    .setEmoji("🔺")
    .setStyle("PRIMARY");
const textSizeRow = new MessageActionRow()
    .setComponents([textSizeMinusTen, textSizeMinusOne, textSize, textSizePlusOne, textSizePlusTen]);

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