const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");
module.exports = async function collectorEnd(message, kill, client) {
    const rows = message.components;
    try{
        rows.forEach(row => {
            row.components.forEach(component => {
                component.setDisabled(true);
            });
        });
    }
    catch(err) {console.log(err);}
    if(kill) {
        const cancelEmbed = new MessageEmbed()
            .setColor(color)
            .setAuthor("Cancelled", client.user.avatarURL())
            .setDescription("Successfully cancelled your image creation!");
        client.imageCreation.delete(message.channel.recipient.id);
        message.channel.send({ embeds: [cancelEmbed] });
    }
    return await message.edit({ embeds: message.embeds, components: rows ?? [] });
};