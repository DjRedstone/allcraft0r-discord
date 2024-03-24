const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("oui")
        .setDescription("Demande acceptée")
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Une raison")
            .setRequired(false)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("⚠️ Message de la hiérarchie ⚠️")
            .setDescription(`Votre demande a été acceptée.`)
            .setColor(Colors.Green)
            .setThumbnail("https://images.emojiterra.com/twitter/v13.0/512px/2705.png");
        const txt = interaction.options.getString("reason");
        if (txt) embed.setFooter({text: txt});
        await interaction.reply({embeds: [embed]});
    }
};
