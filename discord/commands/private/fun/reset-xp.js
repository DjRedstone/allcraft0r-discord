const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset-xp")
        .setDescription("Faux message de reset d'XP")
        .addUserOption(option => option
            .setName("user")
            .setDescription("L'utilistateur")
            .setRequired(true)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        await interaction.reply(`L'xp de **${interaction.options.getUser("user").tag}** a bien été réinitialisé ! ✅`);
    }
};
