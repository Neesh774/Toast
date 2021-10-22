const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");
const MultiLine = require("../util/MultiLine");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("test image"),
	cooldown: 1,
	guildOnly: false,
	async execute(interaction) {
        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 500, 500);

        ctx.fillStyle = "black";
        MultiLine(ctx, "123456789123456789", {
            rect: {
                x: 10,
                y: 10,
                width: 120,
                height: 400,
            },
            maxFontSize: 300,
        });
        return await interaction.editReply({
            files: [canvas.toBuffer("image/jpeg", { quality: 0.5 })],
        });
	},
};