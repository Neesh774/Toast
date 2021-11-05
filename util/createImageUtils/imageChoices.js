const { MessageButton, MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const { color } = require("../../config.json");
const renderImage = require("./renderImage");

const background = new MessageButton()
    .setLabel("Switch Background")
    .setEmoji("🪟")
    .setCustomId("background")
    .setStyle("PRIMARY");

const image = new MessageButton()
    .setLabel("Image")
    .setEmoji("🖼️")
    .setCustomId("customImage")
    .setStyle("PRIMARY");

const text = new MessageButton()
    .setLabel("Text")
    .setEmoji("📝")
    .setCustomId("text")
    .setStyle("PRIMARY");

const done = new MessageButton()
    .setLabel("Complete")
    .setEmoji("🚀")
    .setCustomId("complete")
    .setStyle("DANGER");

const row = new MessageActionRow()
    .setComponents([background, image, text, done]);

module.exports = async function imageChoices(client, user) {
    const choiceEmbed = new MessageEmbed()
        .setColor(color)
        .setAuthor("Image Creation/Image Editing", client.user.avatarURL())
        .setFooter("Type `cancel` at any time to cancel this process")
        .setDescription("Press one of the buttons below to continue.");
    const options = client.imageCreation.get(user.id).text.map((textObj, index) => {
        return {
            label: textObj.text,
            value: `${index}`,
            description: "A custom text",
        };
    });
    const editText = new MessageSelectMenu()
        .setCustomId("editText")
        .setPlaceholder("Edit Text")
        .setMaxValues(1)
        .setOptions(options);
    const imageFile = (await renderImage(client, user)).toBuffer();
    const editTextRow = new MessageActionRow().addComponents([editText]);
    const rows = [row];
    if(options.length > 0) rows.push(editTextRow);
    return { embeds: [choiceEmbed], components: rows, files: [imageFile] };
};
