const { MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");

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
    .setComponents([image, text, done]);

module.exports = function imageChoices(client, user) {
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
    const editTextRow = new MessageActionRow().addComponents([editText]);
    return [row, editTextRow];
};
