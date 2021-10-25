const { MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");
module.exports = function collectorEnd(message, kill, client) {
    const components = message.components;
    try{
        components.forEach(row => {
            row.components.forEach(component => {
                component.setDisabled(true);
            });
        });
    }
    catch(err) {null;}
    if(kill) {
        const cancelEmbed = new MessageEmbed()
            .setColor(color)
            .setAuthor("Cancelled", client.user.avatarURL())
            .setDescription("Successfully cancelled your image creation!");
        client.imageCreation.delete(message.channel.recipient.id);
        return message.channel.send({ embeds: [cancelEmbed] });
    }
    return message.edit({ embeds: message.embeds, components: components ?? [] });
};