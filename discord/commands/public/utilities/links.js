const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("links")
        .setDescription("Affiche des liens en rapport avec allcraft0r"),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const ytBase = new ButtonBuilder()
            .setLabel("Chaîne Youtube de allcraft0r")
            .setURL("https://www.youtube.com/channel/UCY8ryk_01LytUhgfA5X3vFg")
            .setStyle(ButtonStyle.Link);
        const ytBestOf = new ButtonBuilder()
            .setLabel("Chaîne Youtube Best Of Discord")
            .setURL("https://www.youtube.com/channel/UCQH2Kxrr6Y68ZcBWfJdtZ6A")
            .setStyle(ButtonStyle.Link);
        const twiter = new ButtonBuilder()
            .setLabel("Compte Twitter Best of Discord")
            .setURL("https://twitter.com/bestOfAllcraft?s=09")
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder()
            .addComponents(ytBase, ytBestOf, twiter);

        await interaction.reply({
            content: "Voici plusieurs lien en rapport avec allcraft0r :",
            components: [row],
            ephemeral: true
        });
    }
};
