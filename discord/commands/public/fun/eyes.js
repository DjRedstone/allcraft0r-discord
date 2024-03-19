const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eyes")
        .setDescription("I'm watching you..."),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        await interaction.reply("👁👄👁");
    }
};
