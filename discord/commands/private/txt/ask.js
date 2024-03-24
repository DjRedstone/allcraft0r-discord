const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ask")
        .setDescription("Demande prise en compte"),
    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("⚠️ Message de la hiérarchie ⚠️")
            .setDescription(`Votre demande a été prise en compte. 👍`)
            .setFooter({text: "Nous vous informerons lorsque nous aurons plus d'informations. 📃"})
            .setColor(Colors.Orange);
        await interaction.reply({embeds: [embed]});
    }
};
