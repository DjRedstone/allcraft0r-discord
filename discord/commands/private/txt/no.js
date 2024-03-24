const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("non")
        .setDescription("Demande refusée")
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Une raison")
            .setRequired(false)),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("⚠️ Message de la hiérarchie ⚠️")
            .setDescription(`Votre demande a été refusée.`)
            .setColor(Colors.Red)
            .setThumbnail("https://images.emojiterra.com/google/android-10/512px/274c.png");
        const txt = interaction.options.getString("reason");
        if (txt) embed.setFooter({text: txt});
        await interaction.reply({embeds: [embed]});
    }
};
