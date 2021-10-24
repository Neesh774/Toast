const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { color } = require("../../config.json");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Gives a list of commands for Toast"),
	cooldown: 3,
	guildOnly: false,
	async execute(interaction, client) {
		const categories = client.categories;
        const categoryNames = categories.lastKey(-categories.size);
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle("Toast Commands")
            .setDescription("Select one of the categories below to get more information!")
            .setFooter("Toast", client.user.displayAvatarURL());

        const menu = new MessageSelectMenu()
            .setCustomId("helpmenu")
            .setPlaceholder("Select a category")
            .setMaxValues(1);
        categoryNames.forEach(category => {
            menu.addOptions([{
                label: category,
                value: category,
                description: `The ${category} category`,
            }]);
        });
        const row = new MessageActionRow().addComponents([menu]);
        const message = await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = (i) => categoryNames.includes(i.customId) && i.user.id === interaction.author.id;
        const collector = message.createMessageComponentCollector(filter, { time: 5000 });

        collector.on("collect", async (i) => {
            const commands = categories.get(i.values[0]);
            const categoryEmbed = new MessageEmbed()
                .setColor(color)
                .setTitle(`Toast Commands - ${i.values[0]}`)
                .setFooter("Toast", client.user.displayAvatarURL());
            for(const command of commands) {
                categoryEmbed.addField(command[0], command[1]);
            }
            if(categoryEmbed.fields.length === 0) {
                categoryEmbed.setDescription("No commands found in this category");
            }
            await i.update({ embeds: [categoryEmbed], components: [row] });
        });

        collector.on("end", async () => {
            menu.setDisabled(true);
            row.setComponents([menu]);
            await interaction.editReply({ embeds: [embed], components: [row] });
        });
	},
};