const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tank")
        .setDescription("AMERICA ! F*CK YEAHH !!"),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        await interaction.reply("https://tenor.com/view/tank-gif-10952763");
    }
};
