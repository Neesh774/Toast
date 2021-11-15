const { MessageActionRow, MessageButton } = require("discord.js");

const rotateMinusCoarse = new MessageButton()
    .setLabel("-60°")
    .setCustomId("r-60")
    .setEmoji("↩️")
    .setStyle("PRIMARY");
const rotateMinusFine = new MessageButton()
    .setLabel("-10°")
    .setCustomId("r-10")
    .setEmoji("↩️")
    .setStyle("PRIMARY");
const rotate = new MessageButton()
    .setLabel("rotate")
    .setCustomId("rotate")
    .setEmoji("🔁")
    .setStyle("SECONDARY");
const rotatePlusFine = new MessageButton()
    .setLabel("+10°")
    .setCustomId("r+10")
    .setEmoji("↪️")
    .setStyle("PRIMARY");
const rotatePlusCoarse = new MessageButton()
    .setLabel("+60°")
    .setCustomId("r+60")
    .setEmoji("↪️")
    .setStyle("PRIMARY");

const rotateRow = new MessageActionRow()
    .setComponents([rotateMinusCoarse, rotateMinusFine, rotate, rotatePlusFine, rotatePlusCoarse]);

const sizeMinus = new MessageButton()
    .setLabel("-")
    .setCustomId("s-")
    .setStyle("PRIMARY");
const size = new MessageButton()
    .setLabel("size")
    .setCustomId("size")
    .setEmoji("🔍")
    .setStyle("SECONDARY");
const sizePlus = new MessageButton()
    .setLabel("+")
    .setCustomId("s+")
    .setStyle("PRIMARY");

const sizeRow = new MessageActionRow()
    .setComponents([sizeMinus, size, sizePlus]);

const moveLeft = new MessageButton()
    .setLabel("Left")
    .setCustomId("ml")
    .setEmoji("◀️")
    .setStyle("PRIMARY");
const moveRight = new MessageButton()
    .setLabel("Right")
    .setCustomId("mr")
    .setEmoji("▶️")
    .setStyle("PRIMARY");
const moveUp = new MessageButton()
    .setLabel("Up")
    .setCustomId("mu")
    .setEmoji("🔼")
    .setStyle("PRIMARY");
const moveDown = new MessageButton()
    .setLabel("Down")
    .setCustomId("md")
    .setEmoji("🔽")
    .setStyle("PRIMARY");

const moveRow = new MessageActionRow()
    .setComponents([moveLeft, moveRight, moveUp, moveDown]);

const complete = new MessageButton()
    .setLabel("complete")
    .setCustomId("complete")
    .setEmoji("🚀")
    .setStyle("DANGER");

const completeRow = new MessageActionRow()
    .setComponents([complete]);

module.exports = ([rotateRow, sizeRow, moveRow, completeRow]);