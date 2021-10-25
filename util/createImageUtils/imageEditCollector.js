const { MessageEmbed } = require("discord.js");
const textEditCollector = require("./textEditCollector");
const { color } = require("../../config.json");
const textOptions = require("./textOptions");
const collectorEnd = require("./collectorEnd");
module.exports = async function textEditFunction(message, client) {
    await message.awaitMessageComponent({ max: 1, time: 600000, errors: ["time"] })
        .then(async collected => {
            if(collected.customId === "editText") {
                const textEditEmbed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor("Step 3b", client.user.displayAvatarURL())
                    .setFooter("Type `cancel` at any time to cancel this process")
                    .setDescription("Press one of the buttons below to edit this text object.");
                await collected.reply({ embeds: [textEditEmbed], components: textOptions });
                await textEditCollector(await collected.fetchReply(), client, collected);
            }
        })
        .catch((e) => {
            console.log(e);
            collectorEnd(message, true, client);
        });
};